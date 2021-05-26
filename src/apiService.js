export default function apiService(name, page) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${name}&page=${page}&per_page=12&key=21768307-080db5f9e0b30805274214867`,
  )
    .then(response => {
      if (name) {
        return response.json();
      } else {
        return;
      }
    })
    .catch(error => console.log(error));
}
