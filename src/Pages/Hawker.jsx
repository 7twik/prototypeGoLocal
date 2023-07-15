import axios from "axios";
import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Web3 from "web3";
import HawkersHut from "../contracts/HawkersHut.json";
const Hawker = ({ Ncame }) => {
  const [length, setLength] = React.useState(0);
  const [hawker, setHawker] = React.useState(Ncame);
  const [NoteIns, setNoteIns] = React.useState(null);
  const [NoteIns2, setNoteIns2] = React.useState(null);
  const [per, Sper] = React.useState({ lat: 0, long: 0 });
  const {ethereum} = window;

  const [state, setStatee] = React.useState({
    web3: null,
    contract: null,
  });
  React.useEffect(() => {
   

    async function template() {
      const web3 = new Web3(Web3.givenProvider||"ws://localhost:8545");
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HawkersHut.networks[networkId];
      const contract = new web3.eth.Contract(
        HawkersHut.abi,
        deployedNetwork.address
      );
      console.log(contract);
      setStatee({ web3: web3, contract: contract });
    }
   template();
  }, []);


  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      Sper({
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      });
    });
  }, []);
  React.useEffect(() => {
    if (hawker === null || hawker === "") {
      window.location.replace("http://localhost:5173/");
    }
  }, [hawker]);

  const apihawker = async () => {
    const options = {
      method: "GET",
      url: "https://prehh.onrender.com/api/web3/hawker",
      params: { HUser: hawker },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data)
        setLength(response.data.length);
        response.data.reverse();
        setNoteIns(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const apihawkerdone = async () => {
    const options = {
      method: "GET",
      url: "https://prehh.onrender.com/api/web3/hawkerdone",
      params: { HUser: hawker },
    };
    axios
      .request(options)
      .then((response) => {
        //console.log(response.data)
        response.data.reverse();
        setNoteIns2(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    apihawker();
    apihawkerdone();
  }, [hawker]);

  const hawkerAccept = async (e,id,hash) => {
    const {contract}=state;
    const accountss = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const res=await contract.methods.hawkerId(hash).send({ from: accountss[0] });
    console.log(res);
    const va=res.events.success.returnValues[2].toString();
    alert(res.events.success.returnValues[0]+"\n Payment: "+Web3.utils.fromWei(va, "ether")+" Eth");
    if(res.events.success.returnValues[1])
    {  
      const data={
        id:id
      };///WEB3 CONNECT FUNCTION///////////////////////////////////////
      console.log(data);
      await axios.post("https://prehh.onrender.com/api/web3/hawkeraccept", data);
      window.location.reload();
    }
  }
  const hawkerReach = async (e,id,lat,long,hash) => {
    //console.log(id);
    const data={
      id:id
    };
    console.log(data);
    //const a=true;
    //////////////////////////ADD CIRCLE CONDITION HERE !!!!!!!!!!!!!!!!!!!!
    if((Math.abs(lat-per.lat)>0.03)||(Math.abs(long-per.long)>0.03)) //ADD CIRCLE CONDITION HERE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      alert("Reach near the customer");
    else
    {   
        await axios.post("https://prehh.onrender.com/api/web3/hawkerreach", data);
        window.location.reload();
    }
  }
  const hawkerReceive = async (e,id,hash) => {
    const {contract}=state;
    const accountss = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    ///WEB3 RECEIVE FUNCTION///////////////////////////////////////
    const res=await contract.methods.hawker_withdraw(hash).send({ from: accountss[0] });
    console.log(res);
    const va=res.events.success.returnValues[2].toString();
    alert(res.events.success.returnValues[0]+"\n Payment to your account: "+Web3.utils.fromWei(va, "ether")+" Eth");
    if(res.events.success.returnValues[1])
    {
      //console.log(id);
        const data={
          id:id
        };  
        console.log(data);
        await axios.post("https://prehh.onrender.com/api/web3/hawkerreceive", data);
        window.location.reload();
    }
  }
  const hawkerDeny = async (e,id,hash) => {
    const {contract}=state;
    const accountss = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const res=await contract.methods.cancelPayment(hash).send({ from: accountss[0] });
    console.log(res);
    const va=res.events.success.returnValues[2].toString();
    alert(res.events.success.returnValues[0]+"\n Payment to your account: "+Web3.utils.fromWei(va, "ether")+" Eth");
    if(res.events.success.returnValues[1])
    {
      const data={
        id:id
      };
      console.log(data);
      await axios.post("https://prehh.onrender.com/api/web3/hawkerdeny", data);
      window.location.reload();
    }
  }

  return (
    <div>
      <Tab.Container
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
         <Nav variant="pills" className="flex-row">
            <Nav.Item>
              <Nav.Link eventKey="home">Hawker Window</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="current">Current Orders <Badge bg="secondary">{length}</Badge></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="past">Past Orders</Nav.Link>
            </Nav.Item>
            </Nav>
            <Tab.Content>
        <Tab.Pane eventKey="home">
          WELCOME Hawker {hawker} !
        </Tab.Pane>
        <Tab.Pane eventKey="current">
          Your orders:
          <br />
          <br />
          <>
            {NoteIns === null ? (
              <div>No Orders Currently</div>
            ) : (
              NoteIns.map((note, index) => {
                return <div key={index}>
                  <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Loc</th>
                          <th>Requirement/message</th>
                          <th>Time</th>
                          <th>Accept</th>
                          <th>Deny</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{note.CUser}</td>
                          <td>lat:{note.Lat} | long:{note.Long}</td>
                          <td>{note.Message}</td>
                          <td>{note.updatedAt}</td>
                          <td>{(note.HawkerStage==="Waiting")?
                            <Button variant="success" onClick={event => hawkerAccept(event,note._id,note.Hash)}>Accept</Button>:
                            (note.HawkerStage==="Accepted")?
                            <Button variant="success"  onClick={event => hawkerReach(event,note._id,note.Lat,note.Long,note.Hash)}> Reached</Button>:
                            (note.HawkerStage==="Reached")?
                            <>Please contact {note.CPhone}</>:
                            <></>
                            }
                          </td>
                          <td><Button variant="danger" onClick={event =>hawkerDeny(event,note._id,note.Hash)}>Cancel</Button>{' '}</td>
                        </tr>
                      </tbody>
                    </Table>
                </div>;
              })
            )}
          </>
        </Tab.Pane>
        <Tab.Pane eventKey="past">
          Your past orders:
          <br />
          <br />
          <><Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Customer Name</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Profit</th>
                        </tr>
                      </thead>
                      </Table>
            {NoteIns2 === null ? (
              <div>No Past Orders</div>
            ) : 
              (
              NoteIns2.map((note, index) => {
                return (
                <div key={index}>
                  <Table striped bordered hover>
                        <tr key={index}>
                          <td>{note.CUser}</td>
                          <td>{note.updatedAt}</td>
                          <td>{(note.HawkerStage==="Success")?
                            <Button variant="success"  onClick={event => hawkerReceive(event,note._id,note.Hash)}> Receive</Button>:
                            <>{note.HawkerStage}</>}</td>
                          <td>INR 0</td>
                        </tr>;
                        </Table>
                        </div>);
                }
              ))}
          </>
        </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Hawker;
