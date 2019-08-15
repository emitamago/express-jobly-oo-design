
// simple - just set these two fields
this.setState({firstName: "Joel", lastName: "Button"})

// function form -- new state depends on existing state
this.setState(st => ({hobbies: st.hobbies.filter(..)})


this.setState(arg1, function() {
    console.log("run me one state has been changed", this.state)
} )
