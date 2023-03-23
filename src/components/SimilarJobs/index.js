import {Link} from 'react-router-dom'
import {BsFillStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  console.log(similarJobDetails)
  const {
    employmentType,
    companyLogoUrl,
    id,
    title,
    rating,
    location,
    jobDescription,
  } = similarJobDetails
  console.log(companyLogoUrl)
  return (
    <li className="similar-job-item">
      <Link to={`/jobs/${id}`} className="link">
        <div>
          <div className="job-logo-title-con">
            <img
              src={companyLogoUrl}
              alt="similar job company logo"
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
          </div>
          <div>
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SimilarJobs
