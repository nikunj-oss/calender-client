import Typewriter from 'react-typewriter-effect';
import './hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="overlay">
        <div className="typewriter">
          <Typewriter
            text="Welcome to the Calendar App"
            typeSpeed={100}
            cursorColor="#fff"
            startDelay={100}
            deleteSpeed={50}
            onInit={(typewriter) => {
              typewriter
                .start()
                .pauseFor(1000)
                .deleteAll()
                .start();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
