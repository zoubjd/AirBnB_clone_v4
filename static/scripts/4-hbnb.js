$(document).ready(function () {
    let amenitiesList = [];
    const amenityCheckbox = $(".amenities input[type='checkbox']")
    amenityCheckbox.on('change', function () {
      const name = $(this).data('name');
      const id = $(this).data('id');
      if ($(this).is(':checked')) {
        amenitiesList.push({
          "name": name,
          "id": id
        });
      } else {
        amenitiesList = amenitiesList.filter(function (amenity) {
          return amenity.id != id;
        })
      }
      // amenitiesList.forEach(function (amenity) {
      //   console.log(amenity.name)
      // })
      const amenitiesH4 = $(".amenities h4")
      amenitiesH4.empty();
      amenitiesList.forEach(element => {
        amenitiesH4.append(element.name + ", ")
      });
  
    })
    //Get status
    $.ajax({
      url: "http://127.0.0.1:5001/api/v1/status",
      type: "GET",
      dataType: "json",
      success: function(response) {
        if (response.status === "OK") {
          $("div#api_status").addClass("available");
        } else {
          console.log("Condition not met, removing class");
          $("div#api_status").removeClass("available");
        }
      },
      error: function (xhr, status, error) {
        console.log("API Error:")
        console.log("Status code" + xhr.status)
        console.log(error)
      }
    });
  
    //Search Button logic
    let searchData = {
      "states": [],
      "cities": [],
      "amenities": []
    };
    $("button").on('click', function () {
      console.log("Button clicked")
      searchData.amenities = amenitiesList.map(obj => obj.id.toString())
      searchData.amenities.forEach(id => {
        console.log(id)
      })
      $("section.places").empty()
      fetchPlaces()
    })
    const fetchPlaces = function() {
      $.ajax({
        url: "http://127.0.0.1:5001/api/v1/places_search/",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(searchData),
        success: function(data) {
            data.forEach(function(place) {
              const pluralize = (count, singular, plural) => count === 1 ? singular : plural;
  
              let max_guest_str = pluralize(place.max_guest, "Guest", "Guests");
              let bedroom_str = pluralize(place.number_rooms, "Bedroom", "Bedrooms");
              let bathroom_str = pluralize(place.number_bathrooms, "Bathroom", "Bathrooms");
  
              const article = `
              <article>
                <div class="title_box">
                  <h2>${place.name}</h2>
                  <div class="price_by_night">${place.price_by_night}$</div>
                </div>
                <div class="information">
                  <div class="max_guest">${place.max_guest} ${max_guest_str}</div>
                  <div class="number_rooms">${place.number_rooms} ${bedroom_str}</div>
                  <div class="number_bathrooms">${place.number_bathrooms} ${bathroom_str}</div>
                </div>
                <div class="description">
                  ${place.description}
                </div>
              </article>
              `;
              $('section.places').append(article);
            });//foreach
          },
          error: function (error) {
            console.error('Error:', error);
          }
        });
    }
    fetchPlaces()
  });
