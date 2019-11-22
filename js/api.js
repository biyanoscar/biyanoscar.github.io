const API_KEY = 'ab1e475ab62c4231899e8ff6abfb732d';
const COMPETITION_ID = 2014;
const base_url = "https://api.football-data.org/v2";
var teams_url = `${base_url}/competitions/${COMPETITION_ID}/teams`;
var ranking_url = `${base_url}/competitions/${COMPETITION_ID}/standings`;
var listTeams;

//Fungsi fetch API
var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}


// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  console.log("Error : " + error);
}



//*********** function get Data JSON ***********
function getRankings() {
  if ("caches" in window) {
    caches.match(ranking_url).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          // Menyusun komponen secara dinamis
          rankingsHTMLContent = writeContentHTML_rankings(data);
          document.getElementById("tbl_body_rankings").innerHTML = rankingsHTMLContent;
        });
      }
    });
  }


  fetchApi(ranking_url)
    .then(status)
    .then(json)
    .then(function (data) {
      // Menyusun komponen secara dinamis
      rankingsHTMLContent = writeContentHTML_rankings(data);
      document.getElementById("tbl_body_rankings").innerHTML = rankingsHTMLContent;
    })
    .catch(error);
}


// Blok kode untuk melakukan request data json teams
function getListTeams() {
  if ("caches" in window) {
    caches.match(teams_url).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var str = JSON.stringify(data).replace(/http:/g, 'https:');
          data = JSON.parse(str);

          listTeams = data.teams; //ambil list data team

          let teamsHTMLContent = writeContentHTML_teams(listTeams, "create");

          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTMLContent;
        });
      }
    });
  }


  fetchApi(teams_url)
    .then(status)
    .then(json)
    .then(function (data) {
      var str = JSON.stringify(data).replace(/http:/g, 'https:');
      data = JSON.parse(str);
      listTeams = data.teams; //ambil list data team

      let teamsHTMLContent = writeContentHTML_teams(listTeams, "create");
      document.getElementById("teams").innerHTML = teamsHTMLContent;
    })
    .catch(error);
}


//*********** function write HTML Code  ***********
function writeContentHTML_rankings(data) {
  var rankingsHTML = "";

  var str = JSON.stringify(data).replace(/http:/g, 'https:');
  data = JSON.parse(str);

  data.standings[0].table.forEach(function (ranking) {
    rankingsHTML += `
      <tr>
      <td>${ranking.position}</td>
      <td><img width="30" height="30" src="${ranking.team.crestUrl}" alt="${ranking.team.name}"/> </td>
      <td>${ranking.team.name}</td>
      <td>${ranking.playedGames}</td>
      <td>${ranking.won}</td>
      <td>${ranking.draw}</td>
      <td>${ranking.lost}</td>
      <td>${ranking.goalDifference}</td>
      <td>${ranking.points}</td>
      </tr>
      `;
  });
  return rankingsHTML;

}



//function untuk menulis content HTML halaman Team
function writeContentHTML_teams(listTeams, tipeBtn) {
  var teamsHTML = "";
  var btnTeamHTML1 = "";
  var btnTeamHTML2 = "";
  var i = 1;

  if (tipeBtn === "create") {
    btnTeamHTML1 = `<a href="#!" class="waves-effect waves-light btn gradient-45deg-blue-indigo" onclick="createFavTeam(`;
    btnTeamHTML2 = `)">Favorite</a>`;
  }
  else if (tipeBtn === "delete") {
    btnTeamHTML1 = `<a href="#!" class="waves-effect waves-light btn gradient-45deg-red-pink" onclick="deleteFavTeam(`;
    btnTeamHTML2 = `)">Delete</a>`;
  }



  listTeams.forEach(function (team) {
    if (i % 1 == 0) {
      teamsHTML += `<div class="row">`
    }
    teamsHTML += `
          <div class="col s12 m6 l6">
          <div class="card horizontal">

          <div class="card-content col s3"><img class="responsive-img" src="${team.crestUrl}" alt="${team.name}"></div>
          <div class="card-stacked col s9">
          <div class="card-content">
          <span class="card-title truncate">${team.name}</span>
          <p>${team.venue}</p>
          </div>
          <div class="card-action">`+ btnTeamHTML1 +
      `${team.id}` + btnTeamHTML2 +
      `</div>
          </div>
          </div>
          </div>
          `;

    if (i % 2 == 0) {
      teamsHTML += `</div>`
    }
    i++;

  });
  return teamsHTML;

}


//*********** function indexed DB  ***********
//FUNCTION Insert Favorite Team
function createFavTeam(idData) {
  var team = listTeams.filter(tim => tim.id == idData)[0];

  writeData('fav-teams', team)
    .then(function () {
      console.log('Tim Favorite berhasil disimpan.');
      M.toast({ html: 'Tim Favorite berhasil disimpan!', classes: 'rounded' });
    }).catch(function () {
      console.log('Tim Favorite gagal disimpan.')
    })

}


//FUNCTION Get All Favorite Team
function getAllFavoriteTeams() {
  readAllData('fav-teams')
    .then(function (items) {
      let teamsHTMLContent = writeContentHTML_teams(items, "delete");
      document.getElementById("favorite-teams").innerHTML = teamsHTMLContent;
    })
}

//FUNCTION Delete Favorite Team
function deleteFavTeam(idData) {
  deleteData('fav-teams', idData)
    .then(function () {
      console.log('Tim Favorite berhasil dihapus.');
      M.toast({ html: 'Tim Favorite berhasil dihapus!', classes: 'rounded' });
      getAllFavoriteTeams();
    }).catch(function () {
      console.log('Tim Favorite gagal dihapus.')
    })

}
