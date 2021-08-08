import React , {Component}from 'react'
import { connect } from 'react-redux'
import { ToastNotification, InlineNotification } from 'carbon-components-react'
//import { ExamMode16 } from '@carbon/icons-react'

class ShowNotification extends Component{
  constructor(props)
  {
    super(props)
    this.CloseNotification.bind()
  }

  CloseNotification()
  {
    // Call Dispatched Methods here.
    console.log('Notification Closed')
  }

  render(){ 
    return(    
            ( this.props.ShowNOtification == true && this.props.ShownAlready != true)  ? <div>
                <InlineNotification            
                  title={this.props.NotificationTitle}
                  kind={this.props.kind} 
                  lowContrast='true' 
                  notificationType='inline'
                  subtitle={this.props.Subtitle} 
                  statusIconDescription = {'hello'}
                  iconDescription = {'Close Notification'} // On hover the icon , this text will show
                  onCloseButtonClick = { () => this.CloseNotification()} // Here Dispatched Action is called to set the state in store.              
                />
          </div> : null
    )
  }
}


const mapStateToProps = ({ NotificationsReducer }) => ({
  // States From Store Here.
  ShowNOtification:NotificationsReducer.ShowNOtification ,
	NotificationTitle:NotificationsReducer.NotificationTitle,
	ShownAlready:NotificationsReducer.ShownAlready,
  kind:NotificationsReducer.kind,
  Subtitle : NotificationsReducer.Subtitle
})

const mapDispatchToPros = dispatch => ({
  
  // Dispatch Actions here.
  // Notification Closed Dispatched Action Here....
})

export default connect(mapStateToProps, mapDispatchToPros)(ShowNotification)

