import React from 'react'
import Button from 'react-bootstrap/esm/Button';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';


const Admin = () => {
    const customerRef = React.useRef();
    const navigate = useNavigate();
    const hawkerRef = React.useRef();
    const [notes, setNotes] = React.useState();
    const [notes2, setNotes2] = React.useState();
    const [value, onChange] = React.useState(new Date());
    const [value1, onChange1] = React.useState(new Date());
    const [chartData, setChartData] = React.useState(null);
    const apicustomer = async () => {
        const options = {
            method: "GET",
            url: "https://prehh.onrender.com/api/web3/admin"
        };
        await axios
            .request(options)
            .then((response) => {
                //console.log(response.data)
                response.data.reverse();
                setNotes(response.data);
                setNotes2(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    React.useEffect(() => {
        apicustomer();
    },[]);
    React.useEffect(()=>{
        GraphComponent(notes);
    },[notes])
    React.useEffect(()=>{
        console.log("chartData");
        console.log(chartData);
    },[chartData]);
   
    const GraphComponent = (data) => {
        console.log("GraphComponent");
        console.log(data);
       // Extracting dates and amounts from the data array
        const dates = (data!=null && data!=undefined) ? data.map(item => {
            let dateee = new Date(item.createdAt);
            return dateee;
        }):[];
        const amounts =(data!=null && data!=undefined) ? data.map(item => item.Amt):[];
        console.log("amount"+amounts);
        console.log("date"+dates);
        // Defining the chart data
        setChartData({
          labels: dates,
          datasets: [
            {
              label: 'Amount',
              data: amounts,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
    }
      

    const clickFunc = async () => {
        
        if(value1<value)
        {
               alert("Please select correct date");
               console.log("1");
        }
        else if(value1.getDate()===value.getDate()&&value1.getMonth()===value.getMonth()&&value1.getFullYear()===value.getFullYear())
        {
            const filterBySearch = notes.filter((item) => {
                if ((item.CUser).toLowerCase().includes((customerRef.current.value).toLowerCase())&&(item.HUser).toLowerCase().includes((hawkerRef.current.value).toLowerCase())) {
                return item;
                }
            });
            console.log(filterBySearch);
            console.log("2");
            setNotes(filterBySearch);
        }
        else
        {
            const filterBySearch = notes.filter((item) => {
                let date=new Date(item.createdAt);
                if(date>=value&&date<=value1){
                    console.log(item);
                if ((item.CUser).toLowerCase().includes((customerRef.current.value).toLowerCase())&&(item.HUser).toLowerCase().includes((hawkerRef.current.value).toLowerCase()))  {
                return item;
                }
            }
            });
            console.log(filterBySearch);
            console.log("3");
            setNotes(filterBySearch);
        }
            
    
        
    }
    return (
        <div className='admin'>
            
            <Button variant="primary" onClick={() => {
                navigate('/', { replace: true });
            }}>Home </Button>


            <div>
                <input type="text" placeholder="Enter Customer Name" ref={customerRef} />
                <input type="text" placeholder="Enter Hawker Name" ref={hawkerRef} />
                <DatePicker onChange={onChange} value={value} />
                <DatePicker onChange={onChange1} value={value1} />
                <Button variant="success" onClick={clickFunc}><BiSearch /></Button>
                <Button variant="success" onClick={()=>{setNotes(notes2);}}>Reset</Button>
            </div>
            <div>
                {(notes === null || notes === undefined) ?
                    <>
                        no items currently
                    </>
                    : <div>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Transaction Id</Th>
                                    <Th>Customer Name</Th>
                                    <Th>Hawker Name</Th>
                                    <Th>Date</Th>
                                    <Th>Contract status</Th>
                                    <Th>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {notes.map((note, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{note.Hash}</Td>
                                            <Td>{note.CUser}</Td>
                                            <Td>{note.HUser}</Td>
                                            <Td>{note.createdAt}</Td>
                                            <Td>{note.ContractStage}</Td>
                                            <Td>{note.Amt}</Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </div>}
            </div>
            
        </div>
    )
}

export default Admin