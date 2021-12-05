import React from 'react';
import { Form, FormGroup, Input, Row, Col, Container, Button } from 'reactstrap';
import './App.css';
import Doctors from './dataset/doctors';
import Specialist from './dataset/specialist';
import Appointmentcost from './dataset/appointmentcost';
import Appointmenttiminglist from './dataset/doctoravailability'



//Class Component
class App extends React.Component {
  //Constructor
  constructor(props) {
    super(props);

    this.state = this.getInitialState()
  }
  //Decleration
  getInitialState = () => ({
    orginaldoctorlist: Doctors,//Doctor data set
    orginalappointmenttiminglist: Appointmenttiminglist,//Appointment timing data set
    appointmentcostlist: Appointmentcost,//Appointment cost data set
    specialistlist: Specialist,//Specialist data set
    doctorslist: [],
    appointmenttiminglist: [],
    patientname: '',
    appointmentdate: '',
    specialist: '',
    doctors: '',
    appointmenttime: '',
    appointmentcost: 0,
    doctordisable: true,//doctor dropdown field by defualt disabled
    appointmentcostdisable: true,//appointment text by default disabled
    appointmenttimingdisable: true,//appointment timing dropdown field by default disabled
    errors: {}
  })
  //Onload
  componentDidMount() {
    //predefined data object for implementation
    localStorage.setItem('date', ['2021-12-19', '2021-12-18'])
    localStorage.setItem('timestamp', ['15:00 pm to 15:30 pm'])
  }
  //handle change event for(patient/date)
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ''
      }
    });
  }

  //speciallist change event
  specialistChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ''
      }
    });
    if (e.target.value.toString() === 'Select') {
      this.setState({
        doctordisable: true
      })
      alert("please select speciallist")
    } else {
      let specialistdoctorfilter = this.state.specialistlist.filter(item => item.category === e.target.value).map(({ doctors }) => ({ doctors }))
      let doctorsfilterlist = []
      for (let i = 0; i <= specialistdoctorfilter[0].doctors.length - 1; i++) {

        doctorsfilterlist.push(this.state.orginaldoctorlist.filter(item => item.id.toString() === specialistdoctorfilter[0].doctors[i].toString()).map(({ name }) => ({ name })))

      }
      this.setState({
        doctorslist: doctorsfilterlist,
        doctordisable: false,
        appointmenttimingdisable: true
      })
    }

  }

  //Doctor change event
  doctorslistChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ''
      }
    });
    if (e.target.value.toString() === 'Select') {
      alert("please select doctor")
    } else {
      let doctorsid = this.state.orginaldoctorlist.filter(items => items.name === e.target.value).map(({ id }) => ({ id }))

      let appointmentgetcost = this.state.appointmentcostlist.filter(items => items.doctorid.toString() === doctorsid[0].id.toString()).map(({ cost }) => ({ cost }))
      let appointmenttimings = this.state.orginalappointmenttiminglist.filter(items => items.doctorid.toString() === doctorsid[0].id.toString()).map(({ timings }) => ({ timings }))

      this.setState({
        appointmentcost: appointmentgetcost[0].cost,
        appointmenttiminglist: appointmenttimings[0].timings,
        appointmenttimingdisable: false
      })

    }
  }


  //appointment timing list change event
  appointmenttiminglistChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ''
      }
    });
    let dates = localStorage.getItem('date')
    let timestamp = localStorage.getItem('timestamp')
    console.log(dates, timestamp)
  }
  //Submit event
  handleSubmit = async (e) => {
    e.preventDefault();

    console.log(this.state.patientname, this.state.specialist, this.state.appointmentdate, this.state.appointmenttime, this.state.appointmentcost)

  }

  render() {
    const { errors } = this.state;
    return (
      <>
        <div>
          <h2 style={{ marginTop: "15px", marginLeft: "5px" }}>Medical Appointment</h2>
        </div>

        <Container fluid="true">

          <Form onSubmit={this.handleSubmit}>
            <Row form id="profilesection1">
              <Col md={6}>
                <FormGroup id="profileinputfield">
                  <p for="exampletext" >Patient Name</p>
                  <Input type="text" id="patientname" maxLength="10" autoComplete="off" placeholder=" " value={this.state.patientname} name="patientname" onChange={this.handleChange} required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup id="profileinputfield">
                  <p for="exampletext">Appointment Date</p>
                  <Input style={{ textTransform: "uppercase" }} type="date" dateFormat="dd-mm-yy" id="appointmentdate" placeholder=" " value={this.state.appointmentdate} name="appointmentdate" onChange={this.handleChange} required/>
                </FormGroup>
              </Col>

              <Col md={6}>

                <FormGroup >
                  <p for="exampletext" style={{ fontSize: "13px", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500" }}>Specialist</p>
                  <Input style={{ height: "40px", verticalAlign: "middle", fontSize: "15px" }} type="select" onChange={this.specialistChange} name="specialist" id="specialist" value={this.state.specialist}  required>
                    <option value="Select" selected >Select</option>
                    {this.state.specialistlist.map((specialistlists) => <option id={specialistlists.id} value={specialistlists.category}>{specialistlists.category}</option>)}
                  </Input>
                  <span id="errormessage">{errors.specialist}</span>
                </FormGroup>
              </Col>
              <Col md={6}>

                <FormGroup >
                  <p for="exampletext" style={{ fontSize: "13px", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500" }}>Doctors</p>
                  <Input style={{ height: "40px", verticalAlign: "middle", fontSize: "15px" }} type="select" onChange={this.doctorslistChange} disabled={this.state.doctordisable} name="doctors" id="doctors" value={this.state.doctors} required >
                    <option value="Select" selected >Select</option>
                    {this.state.doctorslist.map((item) => <option value={item[0].id}>{item[0].name}</option>)}

                  </Input>
                  <span id="errormessage">{errors.doctors}</span>
                </FormGroup>
              </Col>
              <Col md={6}>

                <FormGroup >
                  <p for="exampletext" style={{ fontSize: "13px", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500" }}>Appointment timings</p>
                  <Input style={{ height: "40px", verticalAlign: "middle", fontSize: "15px" }} type="select" onChange={this.appointmenttiminglistChange} disabled={this.state.appointmenttimingdisable} name="appointmenttime" id="appointmenttime" value={this.state.appointmenttime} required>
                    <option value="Select" selected >Select</option>
                    {this.state.appointmenttiminglist.map((item) => <option value={item}>{item}</option>)}

                  </Input>
                  <span id="errormessage">{errors.appointmentcost}</span>
                </FormGroup>
              </Col>
              <Col md={6}>

                <FormGroup >
                  <p for="exampletext" style={{ fontSize: "13px", fontFamily: "Roboto", fontStyle: "normal", fontWeight: "500" }}>Appointment Cost</p>
                  <Input style={{ textTransform: "uppercase" }} type="text" disabled={this.state.appointmentcostdisable} id="appointmentcost" placeholder=" " value={this.state.appointmentcost} name="appointmentcost" onChange={this.handleChange} required />
                  <span id="errormessage">{errors.appointmentcost}</span>
                </FormGroup>
              </Col>


            </Row>
            <Button>Submit</Button>
          </Form>
        </Container>


      </>

    );
  }
}
export default App;
