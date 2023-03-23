import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const fetchState = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},

    employmentFilters: [],
    jobsList: [],
    searchInput: '',
    salaryRange: '',
    fetchStatus: 'INITIAL',
    profilefetchStatus: 'INITIAL',
  }

  componentDidMount() {
    this.fetchProfileDetail()
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    const {employmentFilters, searchInput, salaryRange} = this.state
    this.setState({fetchStatus: fetchState.inProgress})
    const checkedEmployments = employmentFilters.join(',')
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkedEmployments}&search=${searchInput}&minimum_package=${salaryRange}`
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedJobsData = data.jobs.map(item => ({
        id: item.id,
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        fetchStatus: fetchState.success,
      })
    } else {
      this.setState({fetchStatus: fetchState.failure})
    }
  }

  fetchProfileDetail = async () => {
    this.setState({profilefetchStatus: fetchState.inProgress})
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        profilefetchStatus: fetchState.success,
      })
    } else {
      this.setState({profilefetchStatus: fetchState.failure})
    }
  }

  renderProfileView = () => {
    const {profileDetails} = this.state

    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-con">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  setCheckStatus = async event => {
    const {employmentFilters} = this.state
    if (employmentFilters.includes(event.target.id)) {
      const updatedFilter = employmentFilters.filter(
        item => item !== event.target.id,
      )
      await this.setState({employmentFilters: updatedFilter})
      this.fetchJobDetails()
    } else {
      await this.setState(prevState => ({
        employmentFilters: [...prevState.employmentFilters, event.target.id],
      }))
      this.fetchJobDetails()
    }
  }

  changeEmployeeList = async event => {
    const {employmentFilters} = this.state
    console.log(employmentFilters)
    console.log(event.target.id)

    const inputNotInList = employmentFilters.filter(
      eachItem => eachItem === event.target.id,
    )
    // console.log(inputNotInList)
    if (inputNotInList.length === 0) {
      await this.setState(
        prevState => ({
          employmentFilters: [...prevState.employmentFilters, event.target.id],
        }),
        this.fetchJobDetails,
      )
    } else {
      const filteredData = employmentFilters.filter(
        eachItem => eachItem !== event.target.id,
      )
      // console.log(filteredData)

      await this.setState(
        {employmentFilters: filteredData},
        this.fetchJobDetails,
      )
    }
  }

  renderEmploymentFilters = item => {
    const {label, employmentTypeId} = item
    return (
      <li className="employment-filter-item" key={employmentTypeId}>
        <input
          type="checkbox"
          id={employmentTypeId}
          onClick={this.changeEmployeeList}
          value={employmentTypeId}
        />
        <label htmlFor={employmentTypeId}>{label}</label>
      </li>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    console.log(event.key)
    if (event.key === 'Enter') {
      console.log('enter')
      this.fetchJobDetails()
    }
  }

  renderSearchBarLg = () => {
    const {searchInput} = this.state
    return (
      <div className="job-search-form-lg">
        <input
          type="search"
          placeholder="Search"
          className="job-search-bar"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onclickRetryJobs}
        >
          <BsSearch
            color="#cbd5e1"
            width={30}
            height={30}
            className="search-icon"
          />
        </button>
      </div>
    )
  }

  renderSearchBarSm = () => {
    const {searchInput} = this.state
    return (
      <div className="job-search-form-sm">
        <input
          type="search"
          placeholder="Search"
          className="job-search-bar"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
          value={searchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onclickRetryJobs}
        >
          <BsSearch
            color="#cbd5e1"
            width={30}
            height={30}
            className="search-icon"
          />
        </button>
      </div>
    )
  }

  renderNoJobsFound = () => (
    <div className="no-jobs-con">
      <img
        className="no-jobs-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state

    return (
      <>
        <div>
          {jobsList.length === 0 ? (
            this.renderNoJobsFound()
          ) : (
            <ul className="job-list-con">
              {jobsList.map(item => (
                <JobItem key={item.id} jobDetails={item} />
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  setSalaryStatus = event => {
    const salary = event.target.id
    this.setState({salaryRange: salary}, this.fetchJobDetails)
  }

  renderSalaryFilters = item => {
    const {label, salaryRangeId} = item
    return (
      <li className="employment-filter-item" key={salaryRangeId}>
        <input
          type="radio"
          id={salaryRangeId}
          onClick={this.setSalaryStatus}
          value={salaryRangeId}
          name="salary"
        />
        <label htmlFor={salaryRangeId}>{label}</label>
      </li>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-con">
      <Loader color="#ffffff" height={50} width={50} />
    </div>
  )

  onclickRetryJobs = () => {
    this.fetchJobDetails()
  }

  jobsFailurePage = () => (
    <div className="no-jobs-con">
      <img
        className="no-jobs-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onclickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderFetchViews = () => {
    const {fetchStatus} = this.state
    switch (fetchStatus) {
      case fetchState.success:
        return this.renderJobsList()
      case fetchState.inProgress:
        return this.renderLoadingView()
      case fetchState.failure:
        return this.jobsFailurePage()
      default:
        return null
    }
  }

  renderProfileFailView = () => (
    <div className="loader-con">
      <button
        type="button"
        className="retry-btn"
        onClick={this.fetchProfileDetail}
      >
        Retry
      </button>
    </div>
  )

  profileFetchView = () => {
    const {profilefetchStatus} = this.state
    switch (profilefetchStatus) {
      case fetchState.success:
        return this.renderProfileView()
      case fetchState.inProgress:
        return this.renderLoadingView()
      case fetchState.failure:
        return this.renderProfileFailView()
      default:
        return null
    }
  }

  renderJobsView = () => (
    <>
      <div className="filter-profile-bar">
        {this.renderSearchBarSm()}
        {this.profileFetchView()}
        <hr />
        <h1>Type of Employment</h1>
        <ul className="employment-filter-con">
          {employmentTypesList.map(item => this.renderEmploymentFilters(item))}
        </ul>
        <hr />
        <h1>Salary Range</h1>
        <ul className="employment-filter-con">
          {salaryRangesList.map(item => this.renderSalaryFilters(item))}
        </ul>
      </div>
      <div className="jobs-view-con">
        {this.renderSearchBarLg()}
        {this.renderFetchViews()}
      </div>
    </>
  )

  render() {
    return (
      <>
        <Header />
        <div className="jobs-body-con">{this.renderJobsView()}</div>
      </>
    )
  }
}
export default Jobs
