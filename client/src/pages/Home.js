import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../componets/Layout";
import Doctlist from "../componets/Doctlist";
import { Row } from "antd";

const Home = () => {
  const [doctor, setdoctor] = useState([]);
  //login user data
  const getuserdata = async () => {
    try {
      const res = await axios.get(
        "/api/getalldoctor"

        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // }
      );
      if (res.data.success) {
        setdoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getuserdata();
  }, []);

  return (
    <Layout>
      <Row>
        {doctor && doctor.map((doc) => <Doctlist key={doc.id} doc={doc} />)}
      </Row>
    </Layout>
  );
};

export default Home;
