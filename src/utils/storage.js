/**
 * Stirage 二次封装
 */
import config from "../config/index"
export default {
  setItem(key,value){
    let stroage = this.getStroage();
    stroage[key]=value;
    window.localStorage.setItem(config.namespace,JSON.stringify(stroage))
  },
  getItem(key){
    return this.getStroage()[key]
  },
  getStroage(){
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}") 
  },
  clearItem(key){
    let stroage = this.getStroage();
    delete stroage[key]
    window.localStorage.setItem(config.namespace,JSON.stringify(stroage))
  },
  clearAll(){
    window.localStorage.clear()
  }
}