


import Appbar from "@/components/layout/Navbar";
import Header from "@/components/layout/Header";
export default function Home() {

  const name ="Anuj";

  return (<div>
    {
      name?<Appbar name={name}></Appbar>:<Header name={name}></Header>
    }
    
    
    
    
    
  </div>);
}
