# Repository 계층

TypeOrmModule.forFeature([Member, Rating])가 등록한 Repository를 Service에 직접 주입한다.
단순 조회에 custom repository를 추가하지 않는다. SQL 스키마 변경은 sql/에서 관리한다.
