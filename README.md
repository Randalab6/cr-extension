<div align="center">
    <img src="https://github.com/Randalab6/cr-extension/assets/31637771/f10ff793-deda-4859-a7dd-a6ed1fdd5a38" alt="logo" width="100" height="100">
</div>


<p align="center" style="font-size: larger;"><strong>On This Day </strong></p>


## Description
<p>
"On This Day" is a Chrome extension that retrieves and displays historical events that took place on the current date. Each day, it fetches and displays a curated list of historical events that occurred on the current date. 
</p>

This is a living and expermintal project, constantly evolving with new features and improvements. Contributions, suggestions, and feedback from the community are always welcome. 

## Features

- **Historical Events**: View random historical events that happened on this day in history.
- **Favorites**: Like events and save them to your favorites for later reference.
- **Offline Access**: Download events for personal record or offline access.
- **Social Sharing**: Share events on social media.
- **Easy Refresh**: Easily retrieve new events with a click, refreshing your daily historical insights.

<br>
<div align="center">
<img width="400" src="https://github.com/Randalab6/cr-extension/assets/31637771/8d6f4635-59c6-464c-8527-9db506a709bb">
    <img width="390" src="https://github.com/Randalab6/cr-extension/assets/31637771/9fd998c9-5a76-4d6e-ba8e-d8139aecd0e0">
</div>




## Technologies 

- TypeScript
- React
- TailwindCSS
- Node.js & Express
- Unsplash JS API
- Wikipedia API
- MongoDB

## Setup and Installation

**Clone Repository**

**Setup for Backend**

  ``` bash
    cd server
    yarn install
   ```

**Setup for Frontend**

  ``` bash
    cd client
    yarn install
  ```

### Environment Variables and Prerequisites

- Ensure Node.js (v20.1.0 or later) is installed.
-`PORT`: the backend server runs on 8000
-`MONGODB_USERNAME`: MongoDB username for connection string
- MONGODB_PASS`: MongoDB password for connection string

### Running the Application

**Backend**
``` bash
cd server
yarn server
```

**Frontend**
``` bash
cd client
yarn client
```

## Usage and Contribution

This extension is currently not published. To use it as a Chrome extension, upload the client build into Chrome's 'Unload Pack' after setting up the environment variables. This project can serve as a template to customize your cards or contribute to styling and refining the query algorithm.

<div align="center">
    <img width="429" alt="Screenshot 2023-12-07 at 9 53 29 PM" src="https://github.com/Randalab6/cr-extension/assets/31637771/09e7dc29-5dbd-4e0b-9a23-b883cd264843">
</div>


## License 
This project is licensed under the MIT License.
