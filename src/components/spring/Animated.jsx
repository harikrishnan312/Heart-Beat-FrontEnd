import { useSpring, animated } from 'react-spring'
import match from '../images/match.png'

const SlideComponent = () => {

    // const props = useSpring({ to: { transform: 'translateX(900px)' }, from: { transform: 'translateX(0px)' } });
    const props = useSpring({
        to: async (next) => {
          while (true) {
            await next({ transform: 'translate(100px, 0px)' });
            await next({ transform: 'translate(0px, 100px)' });
            await next({ transform: 'translate(-100px, 0px)' });
            await next({ transform: 'translate(0px, -100px)' });
          }
        },
        from: { transform: 'translate(0px, 0px)' },
        config: { tension: 100, friction: 50 }, // Adjust the tension and friction values for a smoother circular motion
      });
    return (
        <>
            <animated.div style={props}>
                <img className='img-fluid' src={match} alt="" />
            </animated.div>
            <br />
            <br />
                <p style={{fontSize:'1.5em',fontWeight:'bold',color:'grey',paddingTop:'2em'}}>"Discover a world of possibilities and find your perfect match with our revolutionary dating platform."</p>
        </>
    );
};

export default SlideComponent;