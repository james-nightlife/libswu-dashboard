import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const Home = () => {
    const [booking, setBooking] = useState();
    const timerId = useRef(null);

    const fetchBooking = async () => {
        console.log('Fetch Booking')
        try{
            const req = await axios.get(
                'https://lib-booking.swu.ac.th/api/rooms/status',
                {
                    headers:{
                        'x-api-key': import.meta.env.VITE_LIB_BOOKING_X_API_KEY
                    }
                }
            )
            setBooking(req.data);
        }catch(e){
            console.error(e)
        }
        
    }

    const realTimeUpdate = () => {
        return setInterval(() => fetchBooking(), 1000*10)
    }

    useEffect(() => {
        fetchBooking();
        timerId.current = realTimeUpdate();
        return() => {
            if(timerId.current){
                clearInterval(timerId.current);
                timerId.current = null;
            }
        }
    }, []);

  return (
    <div>Home</div>
  )
}

export default Home