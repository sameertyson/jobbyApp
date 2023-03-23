import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsFillStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'
import Cookies from 'js-cookie'

import SimilarJobs from '../SimilarJobs'
import Header from '../Header'

import './index.css'

const fetchState = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobCard extends Component {
  state = {
    jobCardDetails: {},
    skills: [],
    companyLife: {},
    similarJobs: [],
    fetchStatus: 'INITIAL',
  }

  componentDidMount() {
    this.fetchJobCardDetails()
  }

  fetchJobCardDetails = async () => {
    this.setState({fetchStatus: fetchState.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const url = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      console.log(data)
      const jobDetails = data.job_details
      const similarJobs = data.similar_jobs
      const updlifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }
      const updateSkills = jobDetails.skills.map(item => ({
        name: item.name,
        imageUrl: item.image_url,
      }))
      const updatedData = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: updlifeAtCompany,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,

        title: jobDetails.title,
      }
      const updateSimilarJobs = similarJobs.map(item => ({
        id: item.id,
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        jobDescription: item.job_description,
        location: item.location,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobCardDetails: updatedData,
        skills: updateSkills,
        companyLife: updlifeAtCompany,
        similarJobs: updateSimilarJobs,
        fetchStatus: fetchState.success,
      })
    } else {
      this.setState({fetchStatus: fetchState.failure})
    }
  }

  renderSkills = item => {
    const {imageUrl, name} = item
    return (
      <li className="skill-item-con" key={name}>
        <img src={imageUrl} alt={name} className="skill-logo" />
        <p className="skill-name">{name}</p>
      </li>
    )
  }

  renderLifeAtCompany = lifeAtCompany => {
    const {imageUrl, description} = lifeAtCompany
    return (
      <div className="life-company-con">
        <p>{description}</p>
        <img src={imageUrl} alt="life at company" />
      </div>
    )
  }

  renderJobCard = () => {
    const {jobCardDetails, skills, companyLife, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,

      location,
      packagePerAnnum,
      rating,

      title,
    } = jobCardDetails

    return (
      <>
        <div className="job-card-con">
          <div>
            <div className="job-logo-title-con">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="job-logo"
              />
              <div>
                <h1 className="job-title">{title}</h1>
                <div className="icon-lab-con">
                  <BsFillStarFill color="#fbbf24" className="star-icon" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>

            <div className="package-location-con">
              <div className="icon-lab-con">
                <div className="icon-lab-con">
                  <MdLocationOn className="icon-job" />
                  <p>{location}</p>
                </div>
                <div className="icon-lab-con">
                  <BsBagFill className="icon-job" />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div>
            <div className="dis-view-con">
              <h1>Description</h1>
              <a href={companyWebsiteUrl} className="link">
                Visit <FiExternalLink />
              </a>
            </div>
            <p>{jobDescription}</p>
            <h1>Skills</h1>
            <ul className="skills-con">
              {skills.map(item => this.renderSkills(item))}
            </ul>
            <h1>Life at Company</h1>
            {this.renderLifeAtCompany(companyLife)}
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-con">
          {similarJobs.map(item => (
            <SimilarJobs similarJobDetails={item} key={item.id} />
          ))}
        </ul>
      </>
    )
  }

  onclickRetryJobsJobCard = () => {
    this.fetchJobCardDetails()
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
        onClick={this.onclickRetryJobsJobCard}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-con">
      <Loader color="#ffffff" height={50} width={50} />
    </div>
  )

  renderFetchViews = () => {
    const {fetchStatus} = this.state
    switch (fetchStatus) {
      case fetchState.success:
        return this.renderJobCard()
      case fetchState.inProgress:
        return this.renderLoadingView()
      case fetchState.failure:
        return this.jobsFailurePage()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="card-route-con">{this.renderFetchViews()}</div>
      </>
    )
  }
}
export default JobCard
