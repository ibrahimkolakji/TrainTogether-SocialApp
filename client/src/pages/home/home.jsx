import "./home.scss";

import Posts from "../../components/posts/posts";
import CreatePosts from "../../components/createPosts/createPosts";

const Home = () => {
    return (
        <div className="home">
         <CreatePosts/>
            <Posts/>
        </div>
    );
};

export default Home;