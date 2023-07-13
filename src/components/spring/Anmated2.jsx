import { useSpring, animated } from 'react-spring'
import pic from '../images/slide.png'

const SpringComponent2 = () => {

    // const props = useSpring({ to: { transform: 'translateX(900px)' }, from: { transform: 'translateX(0px)' } });
    const props = useSpring({
        from: { transform: 'scale(1)' },
        to: async (next) => {
          while (true) {
            await next({ transform: 'scale(1.2)' }); // Zoom in by 10%
            // await next({ transform: 'scale(1)' }); // Reset back to the original scale
            // await next({ transform: 'scale(0.9)' }); // Zoom out by 10%
            await next({ transform: 'scale(1)' }); // Reset back to the original scale
          }
        },        config: { tension: 5, friction: 1 }, // Adjust the tension and friction values for a smoother circular motion

      });
      
    return (
        <>
            <animated.div style={props}>
                <div style={{display:'flex',justifyContent:'center'}}>
                <img className='img-fluid' src={pic} alt=""style={{width:'30em'}} />
                </div>
            </animated.div>
        </>
    );
};

export default SpringComponent2;