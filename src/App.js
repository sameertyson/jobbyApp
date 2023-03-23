import {Switch, Route, Redirect} from 'react-router-dom'

import JobCard from './components/JobCard'
import Jobs from './components/Jobs'
import NotFound from './components/NotFound'
import Home from './components/Home'
import ProtectedRoute from './components/protectedRoute'
import Login from './components/Login'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobCard} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
