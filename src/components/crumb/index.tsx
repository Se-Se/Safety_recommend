import { Breadcrumb } from '@tencent/tea-component';
import React, { useEffect, useState } from 'react';
import cookie from 'react-cookies';
import { Link } from 'react-router-dom';
export default function BreadcrumbPage(props: any) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const val = cookie.load('safetyTrade');
    let arr = props.crumbs;
    if (arr) {
      arr[0].name = val;
    }
    setOptions(arr);
  }, [props.crumbs]);
  return (
    <Breadcrumb>
      {(props.crumbs || []).map((item, index) => {
        return (
          <Breadcrumb.Item key={index}>
            {index === 0 ? <Link to={item.link}>{item.name}</Link> : item.name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
