const useQuery = () => {
  return new URLSearchParams(window.location.search)
}

export default useQuery
