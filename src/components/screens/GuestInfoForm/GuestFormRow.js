import React, {Component} from 'react';
import {View, Text, TextInput,Picker,Item} from 'react-native';
import styles from './styles';
import RNPickerSelect from 'react-native-picker-select';
import PropTypes from 'prop-types';
import { getUserInfo } from '../../../utils/requester';

export default class GuestFormRow extends Component {
    constructor(props) {
        super(props);
        
        this.handleGuestInfo = this.handleGuestInfo.bind(this);
        
        this.state = {
            gender:[
                {
                    key : 0,
                    value:'Mr'
                },
                {
                    key : 1,
                    value:'Mrs'
                }
            ],
            guest: {
                genderRepresentation: 'Mr',
                firstName: '',
                lastName: ''
            },
            guestRecord : {}
        }
        if (this.props.itemIndex == 0){
            getUserInfo()
                .then(res => res.response.json())
                .then(parsedResp => {
                    this.setState({
                        guest: { ...this.state.guest, firstName : parsedResp.firstName == null? '': parsedResp.firstName, lastName : parsedResp.lastName == null? '': parsedResp.lastName},
                    });
                    this.props.onFirstNameChange(0, parsedResp.firstName == null? '': parsedResp.firstName);
                    this.props.onLastNameChange(0, parsedResp.lastName == null? '': parsedResp.lastName)
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }

    handleGuestInfo(){
        this.setState(
            {
                guestRecord :{
                    "title": this.state.guest.genderRepresentation,
                    "firstName": this.state.guest.firstName,
                    "lastName": this.state.guest.lastName
                }
            }
        );
        this.props.onProceedClick(this.props.itemIndex,this.state.guestRecord)
    }
    componentDidMount() {
        this.setState({
            guest: this.props.guest
        });
    }

    onValueChange = value => {     
        this.setState({
            gender:value,
            genderRepresentation: value
        });
      }

    textDone() {
        this.setState(
            {
                guestRecord :{
                    "title": this.state.guest.genderRepresentation,
                    "firstName": this.state.guest.firstName,
                    "lastName": this.state.guest.lastName
                }
            }
        );
        this.props.onTextDone(this.props.itemIndex,this.state.guestRecord);
    }

    render() {
        return (
            <View style={styles.guestInfoWrapper} key={this.props.guest.key}>
                <Text style={styles.labelGuest}>Guest</Text>
                <View style={styles.inputFieldsView}>
                    <View style={styles.genderFlex}>
                        <View style={[styles.gender, styles.spaceRight]}>
                        
                            <Picker selectedValue={this.state.gender} 
                            style={{height: '100%', width: '100%',}}
                            itemStyle={{height:'100%',fontFamily: 'FuturaStd-Light',}}
                            onValueChange={this.onValueChange}>
  
                                <Item label="Mr" value="Mr" />
                                <Item label="Mrs" value="Mrs" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.firstNameFlex}>
                        <TextInput
                            style={[styles.formField, styles.spaceRight]}
                            onChangeText={(text) => {this.props.onFirstNameChange(this.props.itemIndex,text), this.setState({guest: {...this.state.guest, firstName: text}}) }}
                            //onBlur={() => this.textDone()}
                            placeholder={this.props.itemIndex==0? "First Name": "Optional"}
                            underlineColorAndroid="#fff"
                            value={this.state.guest.firstName}
                        />
                    </View>
                    <View style={styles.lastNameFlex}>
                        <TextInput
                            style={styles.formField}
                            onChangeText={(text) => {this.props.onLastNameChange(this.props.itemIndex,text), this.setState({guest: {...this.state.guest, lastName: text}}) }}
                            placeholder={this.props.itemIndex==0? "Last Name": "Optional"}
                            underlineColorAndroid="#fff"
                            value={this.state.guest.lastName}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
GuestFormRow.propTypes = {
    onFirstNameChange: PropTypes.func.isRequired,
    onLastNameChange: PropTypes.func.isRequired,
};