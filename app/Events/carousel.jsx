import React, { useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Autoplay from 'embla-carousel-autoplay'
import './carousel.css'

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true}, [Autoplay()])

  const scrollPrev = useCallback(() => {    
    if (emblaApi) emblaApi.scrollPrev()  }, [emblaApi])
  const scrollNext = useCallback(() => {    
  if (emblaApi) emblaApi.scrollNext()  }, [emblaApi])

  const options = {  align: 'center',  containScroll: true, stopOnInteraction: false,}
  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        
        <div className="embla__slide">
          <img src="./1.png" alt="" />

          <div className="embla__text">
            <div className="embla__title">
              Heron's Night Heron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's Night
            </div>
            <div className="embla__description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut ullam molestiae soluta rem recusandae commodi, nemo possimus architecto mollitia repudiandae ipsa numquam ut iusto sit a quaerat laudantium labore? Harum!
            </div>
          </div>
        </div>

        <div className="embla__slide">
          <img src="./2.png" alt="" />

          <div className="embla__text">
            <div className="embla__title">
              Heron's Night Heron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's Night
            </div>
            <div className="embla__description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint quasi repellat magni vero laudantium, quas libero fugiat voluptatibus quis repudiandae nemo saepe laborum modi cumque, iure nobis provident nesciunt possimus?
            </div>
          </div>

        </div>
        <div className="embla__slide">
          <img src="./3.png" alt="" />

          <div className="embla__text">
            <div className="embla__title">
              Heron's Night Heron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's NightHeron's Night
            </div>
            <div className="embla__description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste necessitatibus at ut, dicta dolorum facilis amet consequatur modi, temporibus tempore, corrupti voluptate harum iusto hic? Officiis nostrum corrupti in quas.
            </div>
          </div>

        </div>
        
      </div>
      <div className="embla__buttons">
        <button className="embla__prev" onClick={scrollPrev}>       
        <ArrowBackIosNewIcon/>
          </button>      
        <button className="embla__next" onClick={scrollNext}>        
        <ArrowForwardIosIcon/>
        </button>
      </div>
    </div>
  )
}
