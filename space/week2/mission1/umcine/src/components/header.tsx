import "./header.css"
import movieCreationIcon from '../assets/logo.svg';
import searchIcon from '../assets/search.svg';


function Header()
{
    return (
        <header className ="topbar">
            <div className = "brand-row">
                <div className = "brand">
                    <span className="mark">
                        <img className="logo" src={movieCreationIcon} alt="UMCine Logo" />
                    </span>
                    <span className="brand-name">UMCine</span>
                </div>

                <div className = "nav">
                    <span className="nav-item active">영화</span>
                    <span className="nav-item inactive">검색</span>
                    <span className="nav-item inactive">내 정보</span>
                </div>
            </div>

            <div className = "top-actions">
                <button className = "search">
                    <img src={searchIcon} alt="Search" />
                </button>
                <button className = "login">로그인</button>
            </div>
        </header>
    );
}

export default Header;