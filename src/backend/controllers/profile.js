
const profile = (req, res) => {
    // if (req.body.method === 'add'){
    //   addUser(req,res) 
    // } else if (req.body.method === 'check'){
    //   checkUserExistence(req,res) 
    // } else if (req.body.method === 'revoke'){
    //   revokeAccessToUser(req,res) 
    // } else if (req.body.selection === 'all'){
    //   getAllUsers(req,res) 
    // } else {
      let data = req.body
      let response = setProfile(req, data)
      res.send(JSON.stringify(response))
    // }
};


export const setProfile = async (req, data) => {
  await req.app.get('mongoose').collection('profiles').updateOne({ id: data.id }, {$set: data}, {upsert: true})
  return await req.app.get('mongoose').collection('users').findOne({ id: data.id })
}

    //Looks for matching information, returns first result
  const getProfile = async (req, id='') => {
      return new Promise(async resolve => {
          let user = await req.app.get('mongoose').collection('users').findOne({id}) //encryption references
          if (user) {
            let authCursor =  await req.app.get('mongoose').collection('authorizations').find({ authorized: user.id })
            user.authorizations = []
            let count = await authCursor.count()
            if (count > 0) {
              let ind = 0
              await authCursor.forEach(async (d) => {
                  d.authorizee = (user.type === 'patient') ? user : await req.app.get('mongoose').collection('users').findOne({id: d.authorizee}) //encryption references
                  d.authorized = (user.type !== 'patient') ? await req.app.get('mongoose').collection('users').findOne({id: d.authorized}) : user //encryption references
                  user.authorizations.push(d)
                  if (ind === count-1) resolve(user) 
                  else ind++    
              })
            } else {
              resolve(user)
            }
          } else {
            resolve({id, authorizations: []})
          } 
      })

  }