import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import "../App.css"

const localizer = dayjsLocalizer(dayjs)

const events = [
  {
    start: dayjs('2025-02-10T12:00:00').toDate(), 
    end: dayjs('2025-02-10T12:30:00').toDate(),
    title: "Visita veterinaria"
  },
  {
    start: dayjs('2025-02-05T12:00:00').toDate(),
    end: dayjs('2025-02-05T12:00:00').toDate(),
    title: "Medicación"
  }
]

const components = {
  event: props => {
    return <div style={
      {color: "black",
        fontSize: "12px"
      }
    }>
      {props.title}
    </div>
  }
}

const MyCalendar = (props) => (
   <div className='m-12'>
    
    <Calendar
      className='bg-orange-400'
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      components={components}
    />
  </div>
)

export default MyCalendar