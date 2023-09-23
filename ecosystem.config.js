module.exports = {
  apps : [{
    name: "SentinelDashboard",
    script: 'npm --prefix ./dashboard run start',
  },{
    name: "SentinelServer",
    script: "npm --prefix ./server run start"
  }],
};
