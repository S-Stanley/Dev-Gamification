# How data is fetch

1. User subscribe and add repositories, we store uri, personal-token (and basic auth if they specifed)
1. A script is runnign from `scripts/fetch_data.sh` once a day
1. We are looping on the collection of repositories `repo` getting every uri of each user
1. For each repo, we are fetching all projects from that uri and store it in `project` collection. We also store the relation between users who made that request and projects on the collection `project_user`
1. For each project of `project_user` we are fetching every merge request merged and store it