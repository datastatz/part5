import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  return (
    <div>
      {!visible && (
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      )}
      {visible && (
        <div>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      )}
    </div>
  )
}

export default Togglable
