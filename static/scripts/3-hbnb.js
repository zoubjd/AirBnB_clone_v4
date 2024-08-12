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
  
    $.ajax({
      url: "http://127.0.0.1:5001/api/v1/status",
      type: "GET",
      dataType: "json",
      success: function(response) {
        console.log("Full response:", response);
        console.log("Status:", response.status);
        console.log("Type of status:", typeof response.status);
  
        if (response.status === "OK") {
          console.log("Condition met, adding class");
          $("div#api_status").addClass("available");
        } else {
          console.log("Condition not met, removing class");
          $("div#api_status").removeClass("available");
        }
  
        console.log("Element exists:", $("div#api_status").length > 0);
        console.log("Current classes:", $("div#api_status").attr("class"));
      },
      error: function (xhr, status, error) {
        console.log("API Error:")
        console.log("Status code" + xhr.status)
        console.log(error)
      }
    });
  
    $.ajax({
      url: "http://127.0.0.1:5001/api/v1/places_search/",
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function(data) {
          data.forEach(function(place) {
              let max_guest_str, bedroom_str, bathroom_str;
              if (place.max_guest === 1) {
                max_guest_str = "Guest"
              } else {
                max_guest_str = "Guests";
              }
              if (place.number_rooms === 1) {
                bedroom_str = "Bedroom"
              } else {
                bedroom_str = "Bedrooms";
              }
              if (place.number_bathrooms === 1) {
                bathroom_str = "Bathroom"
              } else {
                bathroom_str = "Bathrooms";
              }
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
          });
      }
    })
  });
