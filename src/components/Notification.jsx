const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div style={{
        border: '1px solid black',
        padding: '10px',
        marginBottom: '10px'
      }}>
        {message}
      </div>
    )
  }
  
  export default Notification
  