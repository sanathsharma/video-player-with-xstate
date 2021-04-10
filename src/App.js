import Video from "components/Video";
import assets from "constants/assets.contents";

const App = () => {
    return (
        <Video title="Demo Video" src={assets.videos.demo_video} type="video/mp4" />
    );
};

export default App;