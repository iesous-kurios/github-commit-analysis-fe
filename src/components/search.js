
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useAppState } from '../context/app-state-context';
import RepoListItem from '../components/RepoListItem';

const RepoContainer = styled.div`
display: flex;
flex-direction: column;
width: 300px;
height: 100vh;
overflow: scroll;
`
const RepoSearch = () => {
  const {
    state: { token },
  } = useAppState();

  const { state, setState, repositoryListItemClickHandler } = useAppState();

  const [repoList, setRepoList] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [filterList, setFilterList] = useState(repoList);
  
  useEffect(() => {
    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/repo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((data) => {
      setRepoList(data.data.repositories);
    })
    .catch(() => null);
  }, [token]);
  
  const handleChange = e => {
    setSearchTerm(e.target.value)
  };
  
  const handleSubmit = e => {
    e.preventDefault();
    const searchResults = repoList.filter(repo => {
      return repo.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    setFilterList(searchResults);
  };
  
  return (
    <div>
      <form
      onSubmit={handleSubmit}
      >
        <label htmlFor="repo-name"></label>
        <input
          placeholder="search my repos"
          id="repo-name"
          name="repo-name"
          type="text"
          value={searchTerm}
          onChange={handleChange}
        />
        <button>Search</button>
      </form>
      <RepoContainer>
        { filterList.length === 0 ?
          repoList.map((repository, index) => 
            RepoListItem(
              repository,
              index,
              state,
              setState,
              repositoryListItemClickHandler
            )
          ) :
          filterList.map((repository, index) => 
          RepoListItem(
            repository,
            index,
            state,
            setState,
            repositoryListItemClickHandler
           )
          )
        }
      </RepoContainer>
    </div>
  )
};
export default RepoSearch;