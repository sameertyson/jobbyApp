import {Link} from 'react-router-dom'
import {BsFillStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
  } = jobDetails

  const renderTopLayout = () => (
    <div>
      <div className="job-logo-title-con">
        <img src={companyLogoUrl} alt="company logo" className="job-logo" />
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
  )

  const renderLowerLayout = () => (
    <div>
      <h1>Description</h1>
      <p>{jobDescription}</p>
    </div>
  )

  return (
    <li className="job-item-con">
      <Link className="link" to={`/jobs/${id}`}>
        {renderTopLayout()}
        <hr />
        {renderLowerLayout()}
      </Link>
    </li>
  )
}
export default JobItem
