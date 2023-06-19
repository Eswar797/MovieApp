import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import Cookies from 'js-cookie';

import NavBar from '../NavBar';
import MovieItems from '../MovieItems';
import Footer from '../Footer';
import FailurePage from '../FailurePage';

import './index.css';

const renderConstraints = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  loading: 'LOADING',
};

const isPopular = true; // Change to false for top-rated module

class TopRated extends Component {
  state = { topRatedMoviesList: [], renderStatus: renderConstraints.initial };

  componentDidMount() {
    this.getTopRatedMoviesData();
  }

  getTopRatedMoviesData = async () => {
    this.setState({ renderStatus: renderConstraints.loading });
    const jwtToken = Cookies.get('jwt_token');
    const topRatedMoviesApi = 'https://apis.ccbp.in/movies-app/top-rated-movies'; // Adjust API endpoint for top-rated movies
    const options = {
      method: 'GET',
      headers: { Authorization: `Bearer ${jwtToken}` },
    };
    try {
      const response = await fetch(topRatedMoviesApi, options);
      if (response.ok) {
        const data = await response.json();
        const fetchedTopRatedMoviesData = data.results.map((eachMovie) => ({
          backdropPath: eachMovie.backdrop_path,
          id: eachMovie.id,
          posterPath: eachMovie.poster_path,
          title: eachMovie.title,
        }));
        this.setState({
          topRatedMoviesList: fetchedTopRatedMoviesData,
          renderStatus: renderConstraints.success,
        });
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ renderStatus: renderConstraints.fail });
    }
  };

  tryAgainTopRatedData = () => {
    this.getTopRatedMoviesData();
  };

  renderFailureView = () => <FailurePage tryAgain={this.tryAgainTopRatedData} />;

  renderSuccessView = () => {
    const { topRatedMoviesList } = this.state;
    return (
      <>
        <ul className="top-rated-items">
          {topRatedMoviesList.map((eachMovie) => (
            <MovieItems eachMovie={eachMovie} key={eachMovie.id} />
          ))}
        </ul>
        <Footer />
      </>
    );
  };

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  );

  renderSwitchView = () => {
    const { renderStatus } = this.state;
    switch (renderStatus) {
      case renderConstraints.loading:
        return this.renderLoaderView();
      case renderConstraints.success:
        return this.renderSuccessView();
      case renderConstraints.fail:
        return this.renderFailureView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        <NavBar isPopular={isPopular} />
        {this.renderSwitchView()}
      </div>
    );
  }
}

export default TopRated;
