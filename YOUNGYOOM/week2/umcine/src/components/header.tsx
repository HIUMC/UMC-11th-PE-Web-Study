import "./header.css";

interface CategoryProps {
  category: string;
}

interface HeaderProps {
  categories: CategoryProps[];
  currentCat: string;
  onCategoryChange: (category: string) => void;
}

export const Header = ({
  categories,
  currentCat,
  onCategoryChange,
}: HeaderProps) => {
  return (
    <div className="header_container">
      <div className="header_left">
        <div className="header_title">
          <div className="moive_image">
            <img src="/icons/movie.svg" alt="영화" />
          </div>
          <h1>UMCine</h1>
        </div>
        <div className="category_list">
          {categories.map((item) => (
            <span
              key={item.category}
              className={`category_item ${item.category === currentCat ? "active" : ""}`}
              onClick={() => onCategoryChange?.(item.category)}
            >
              {item.category}
            </span>
          ))}
        </div>
      </div>
      <div className="header_left">
        <button className="search">
          <img src="icons/search.svg" alt="검색" />
        </button>
        <button className="login">로그인</button>
      </div>
    </div>
  );
};
