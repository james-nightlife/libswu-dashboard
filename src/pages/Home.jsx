import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const Home = () => {
    const [booking, setBooking] = useState({});
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

    useEffect(() => {
        console.log(booking)
    }, [booking])

  return (
    <div>
        <div>ข้อมูลล่าสุดเมื่อวันที่ {new Date(booking.generatedAt).toLocaleDateString()}</div>
        {booking.campuses && Object.entries(booking.campuses).map(([campus_key, campus_value]) => (
            // Make sure to add a unique 'key' prop to the outermost element in the loop
            <div key={campus_key}>
                <p>Campus: {campus_key}</p>
                {
                    campus_value && Object.entries(campus_value).map(([data_key, data_value]) => (
                        <div style={{display:'flex', gap:'4px'}}>
                            <div>{data_key}</div>
                            <div>
                                {
                                    typeof(data_value) !== 'object' ? 
                                    (data_value || '') : 
                                    data_value.map((room_key) => (
                                        <div style={{display:'flex', gap:'4px'}}>
                                            <div>{room_key.building}</div>
                                            <div>
                                                {room_key.booking && Object.entries(room_key.booking).map(([booking_key, booking_value]) => (
                                                    <div style={{display:'flex', gap:'4px'}}>
                                                        <div>{booking_key}</div>
                                                        <div>{booking_value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>{room_key.campus}</div>
                                            <div>{room_key.capacity}</div>
                                            <div>{room_key.code}</div>
                                            <div>{room_key.floor}</div>
                                            <div>{room_key.id}</div>
                                            <div>{room_key.name}</div>
                                            <div>{room_key.occupancy}</div>
                                            <div>{room_key.roomStatus}</div>
                                            <div></div>
                                        </div>
                                    ))}
                                </div>
                             
                        </div>
            
                    ))
                }
            </div>
        ))}
    </div>
  )
}

export default Home