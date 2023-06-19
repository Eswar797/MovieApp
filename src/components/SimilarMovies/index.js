import './index.css'

const SimilarMovies = props => {
  const {eachMovie} = props
  const {posterPath, title} = eachMovie

  return (
  <div className='popular-items'><img className="similar-movies-img" alt={title} src={posterPath} /> </div>)
}

export default SimilarMovies
