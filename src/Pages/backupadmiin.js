import React from 'react'
import './Admin.css'
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
    const apicustomer = async () => {
        const options = {
            method: "GET",
            url: "http://localhost:8080/api/web3/admin"
        };
        axios
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
    });
    

    const clickFunc = async () => {
        console.log("clicked c=" + customerRef.current.value + ",,h= " + hawkerRef.current.value);
        const filterBySearch = notes.filter((item) => {
            if ((item.CUser).toLowerCase().includes((customerRef.current.value).toLowerCase())&&(item.HUser).toLowerCase().includes((hawkerRef.current.value).toLowerCase())) {
              return item;
            }
          });
          console.log(filterBySearch);
        // if (customerRef.current.value === "" && hawkerRef.current.value === "") {
           
        // }
        
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