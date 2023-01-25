import React from "react";
import { withRouter } from "react-router-dom";
import Auth from "../../views/Auth";
import Avatar from "../Avatar";
import { Row, DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown} from "reactstrap";
import moment from "moment";

const ChatHeader = props => {

    const logout = () => {
        Auth.logout();
        window.location.reload();
        // props.history.push('/');
    };

    const status = () => {
        if(props.typing) return 'يكتب الأن....';
        if(props.contact.status === true) return 'متصل الأن';
        if(props.contact.status) return moment(props.contact.status).fromNow();
    }

    return (
        <Row className="heading m-0">
            <Avatar src={props.contact.avatar} />
            <div className="text-right">
                <div>{props.contact ? props.contact.name : ''}</div>
                <small>{status()}</small>
            </div>
            <Nav className="mr-auto" navbar>
                <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="nac-link">
                        <i className="fa fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={logout}>تسجيل الخروج</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Row>
    )
}

export default withRouter(ChatHeader);