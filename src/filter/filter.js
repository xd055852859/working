import moment from 'moment'
const filter ={
  defaultPerson:(value)=>{
    return value?value:require("../assets/defaultPerson.png")
  },
  defaultGroup:(value)=>{
    return value?value:require("../assets/defaultGroup.png")
  },
  defaultMessageTime:(value)=>{
    // return value?value:require("../assets/defaultGroup.png")
    return moment(value).format('MM/DD HH:mm');
  },
  defaultTime:(value)=>{
    // return value?value:require("../assets/defaultGroup.png")
    return moment(value).format('YYYY/MM/DD HH:mm:ss');
  }   
}
export default filter;