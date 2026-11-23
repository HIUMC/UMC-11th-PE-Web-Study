import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import javax.xml.parsers.DocumentBuilderFactory;

public class VerifyRegression {
    private static Path root;
    private static Path reports;

    public static void main(String[] args) throws Exception {
        root = Path.of(args[0]).toAbsolutePath();
        reports = root.resolve("build/reports/regression-demo");
        Files.createDirectories(reports);
        run("duplicate", "service/FavoriteService.java",
                """
                        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)) {
                            throw new BusinessException(ErrorCode.DUPLICATE_FAVORITE);
                        }
                """, "", "*FavoriteServiceTest.rejectsDuplicateFavorite");
        run("rollback", "service/MovieRecordService.java",
                "    @Transactional\n    public MovieRecordResponse create",
                "    public MovieRecordResponse create",
                "*MovieRecordRollbackTest.rollsBackFlushedRatingWhenFavoriteInsertFails");
        System.out.println("두 실험에서 지정한 테스트의 실제 실패를 확인했습니다. 원본 소스는 수정하지 않았습니다.");
        System.out.println("실패 로그와 HTML 보고서: " + reports);
    }

    private static void run(String name, String source, String oldText, String newText, String test) throws Exception {
        Path temp = Files.createTempDirectory("umc-week9-" + name + "-");
        try {
            for (String item : List.of("src", "gradle", "build.gradle", "settings.gradle", "gradlew", "gradlew.bat")) {
                Path original = root.resolve(item);
                try (var stream = Files.walk(original)) {
                    for (Path path : stream.toList()) {
                        Path target = temp.resolve(root.relativize(path).toString());
                        if (Files.isDirectory(path)) Files.createDirectories(target);
                        else Files.copy(path, target, StandardCopyOption.COPY_ATTRIBUTES);
                    }
                }
            }
            Path file = temp.resolve("src/main/java/com/umc/movie/" + source);
            String text = Files.readString(file);
            if (!text.contains(oldText)) throw new IllegalStateException("원본 코드가 달라 실험을 멈춥니다: " + source);
            Files.writeString(file, text.replace(oldText, newText), StandardCharsets.UTF_8);
            String runner = System.getenv().getOrDefault("UMC_GRADLE_EXECUTABLE", temp.resolve("gradlew").toString());
            var process = new ProcessBuilder(runner, "--offline", "--no-daemon", "--console=plain", "test",
                    "--tests", test, "--rerun-tasks")
                    .directory(temp.toFile()).redirectErrorStream(true)
                    .redirectOutput(reports.resolve(name + ".log").toFile());
            process.environment().put("JAVA_HOME", System.getProperty("java.home"));
            int code = process.start().waitFor();
            Path xml = temp.resolve("build/test-results/test");
            int failures = 0;
            int tests = 0;
            if (Files.isDirectory(xml)) {
                var factory = DocumentBuilderFactory.newInstance();
                factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                try (var stream = Files.list(xml)) {
                    for (Path path : stream.filter(p -> p.getFileName().toString().endsWith(".xml")).toList()) {
                        var doc = factory.newDocumentBuilder().parse(path.toFile());
                        tests += doc.getElementsByTagName("testcase").getLength();
                        var nodes = doc.getElementsByTagName("failure");
                        for (int i = 0; i < nodes.getLength(); i++) {
                            var failure = nodes.item(i);
                            String message = failure.getTextContent();
                            if (message.contains("AssertionError") || message.contains("AssertionFailedError") || message.contains("MultipleFailuresError")) failures++;
                        }
                    }
                }
            }
            if (code == 0 || tests != 1 || failures != 1) {
                throw new IllegalStateException("의도한 단언 실패를 확인하지 못했습니다. " + reports.resolve(name + ".log"));
            }
            Path html = temp.resolve("build/reports/tests/test");
            if (Files.isDirectory(html)) {
                try (var stream = Files.walk(html)) {
                    for (Path path : stream.toList()) {
                        Path target = reports.resolve(name).resolve(html.relativize(path));
                        if (Files.isDirectory(path)) Files.createDirectories(target);
                        else Files.copy(path, target, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }
            System.out.println("PASS: " + name + " 변형에서 " + test + "가 단언 실패했습니다.");
        } finally {
            try (var stream = Files.walk(temp)) {
                for (Path path : stream.sorted(Comparator.reverseOrder()).toList()) Files.deleteIfExists(path);
            }
        }
    }
}
