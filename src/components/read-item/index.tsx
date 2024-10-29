
import { Col } from 'antd';
import './index.less'
import React, { ReactNode } from 'react';
export interface IReadItemProps {
  label?: string;
  value?: string | ReactNode;
  suffix?: string;
  prefix?: string;
  /** 有值才展示 */
  showWithValue?: boolean
  /**
   * 以col作为容器包裹，方便设置栅栏
   */
  needCol?: boolean;
  span?: number;
  className?: string;
}

export default function ReadItem(props: IReadItemProps) {
  const { value, label, suffix = '', prefix = '', needCol = false, span, className = ''} = props;
  const readItem = <div className={`${className} read-item`}>
    <span className="read-item-label" >{label ? label + '：' : ''}</span>
    <span className="read-item-value">{value ? prefix + value + suffix : ''}</span>
  </div>
  if(needCol) {
    return (
      value ? <Col span={span} className={className}>
        {React.isValidElement(value) ? value : readItem}
      </Col> : null
    )
  }
  return readItem
}