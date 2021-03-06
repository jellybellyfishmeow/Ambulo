import React from "react";
import { Modal, ModalTitle, ModalBody } from 'react-bootstrap';
import config from "./config";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.modal,
            trailName: this.props.data.name,
            uid: undefined
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.state.show !== nextProps.modal){
            this.setState({
                show: nextProps.modal
            });
        }
    }

    componentDidMount() {
      this.auth = firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({
                uid: firebase.auth().currentUser.uid,
            })
          }
      })
    }

    componentWillUnmount() {
      this.auth();

    }

    addToFav(){
      let userRef = firebase.database().ref("users/" + this.state.uid + "/favs");
      let favItem = {
        name: this.state.trailName,
        lat: this.props.data.lat,
        long: this.props.data.lon
      }

      userRef.push(favItem)
        .then(alert("added"));
    }

    render() {

        let title = {
            position: "absolute"
        }

        let text = {
            textAlign: "right"
        }

        let activities = [];
        var i = 0;
        this.props.data.activities.forEach(element => {
            activities.push(
                <div key={i}>
                    <h4>{element.activity_type.name}</h4>
                    <p>{element.description}</p>
                </div>
            )
            i++;
        });
        return(
            <div className="modal-container">
                 <Modal
                    show={this.state.show}
                    onHide={this.props.close}>
                    <ModalBody>
                        <div className="row">
                            <ModalTitle style={title} className="col">{this.state.trailName}</ModalTitle>
                            <p className="col-12 cbutton" onClick={this.props.close} style={text}><i className="fa fa-times" aria-hidden="true"></i></p>
                        </div>
                        {this.state.uid != undefined ? <button className="btn-success" onClick={() => this.addToFav()}>Save to Favorites</button> :
                            <div></div>}
                        
                        <div>
                            <div>
                                <iframe
                                    width="100%"
                                    frameBorder="0"
                                    style={{border: "0"}}
                                    src={"https://www.google.com/maps/embed/v1/place?key=" + config.api_keys.map_key
                                        + "&q=" + this.props.data.lat + "," + this.props.data.lon} >
                                    </iframe>
                            </div>
                            <hr />
                            <div>
                                {activities.length != 0 ?
                                    <div>
                                        <h3>Activities</h3>
                                        <div>{activities}</div>
                                    </div>
                                    :
                                    <div></div>
                                }
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
