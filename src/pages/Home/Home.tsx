import FullLayout from "../../components/Layout/FullLayout"
import './Home.css'
import banner from '../../images/banner.png'

const Home = () => {
    return (
    <FullLayout>
        <div className='HomeContent'>
            <img src={banner} alt="banner" />
        </div>
    </FullLayout>
    )
}

export default Home