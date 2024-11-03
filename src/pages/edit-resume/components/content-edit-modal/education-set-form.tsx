import { EDIT_RESUME_NAME_SPACE, IEditResumeModel, IEducationInfoValues } from "@/models/edit-resume";
import { useDebounceFn } from "ahooks";
import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space } from "antd"
import { connect } from "dva";
import { degreeOptions } from "./config";
import QuillEditor from "@/components/quill-editor";
import dayjs from "@/components/extend-dayjs";
import type { Dayjs } from 'dayjs';
import { ContentConfigKeyEnum, SortTypeEnum } from "../../config";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined } from "@ant-design/icons";

export interface IEducationSetFormProps {
  educationInfo?: IEditResumeModel['education'];
  dispatch: React.Dispatch<any>;
  infoModuleList?: IEditResumeModel['moduleList']
}
/** 教育经历表单属性 */
export interface IEducationSetBaseFormProps {
  initValues?: IEducationSetFormValues;
  onChange?: (values: IEducationSetFormValues, index: number) => void;
  index: number;
  length?: number;
  onSort?: (type: SortTypeEnum, index: number) => void
}

/** 教育信息表单初始值 */
export interface IEducationSetFormValues extends Omit<IEducationInfoValues, 'start' | 'end'> {
  start?: Dayjs;
  end?: Dayjs;
};
const format = 'YYYY-MM-DD'
const emptyData = {
  content: '',
  degree: '',
  end: dayjs(),
  major: '',
  name: '',
  start: dayjs(),
  today: false
}

/** 教育经理基础表单 */
function EducationSetBaseForm(props: IEducationSetBaseFormProps) {
  const { initValues, onChange, index, length = 0, onSort } = props;
  const [form] = Form.useForm<IEducationSetFormValues>();
  const colSpan1 = 14, colSpan2 = 10,gutter = 40;

  const { run: onSave } = useDebounceFn(() => {
    const values = form.getFieldsValue()
    onChange?.(values, index)
  }, { wait: 500 })

  const handleSort = (type: SortTypeEnum) => {
    onSort?.(type, index)
  }

  return (
    <div className="common-list-set-form-wrapper">
    <Row justify="end">
      <Space>
        {
          index > 0 && <Button type="primary" ghost onClick={() => handleSort(SortTypeEnum.UP)}>
          上移
          <ArrowUpOutlined />
        </Button>
        }
        {
          length > 1 && index < length - 1 && <Button type="primary" ghost onClick={() => handleSort(SortTypeEnum.DOWN)}>
          下移
          <ArrowDownOutlined />
        </Button>
        }
        {
          length > 1 && <Button type="primary" ghost onClick={() => handleSort(SortTypeEnum.DELETE)}>
          删除
          <DeleteOutlined />
        </Button>
        }
      </Space>
    </Row>
    <Form
      form={form}
      className="common-list-set-form"
      layout="horizontal"
      initialValues={initValues}
      onValuesChange={() => {
        onSave()
      }}
    >
      <Row gutter={gutter}>
        <Col span={colSpan1}>
          <Form.Item name="name" label="学校名称">
            <Input />
          </Form.Item>
        </Col>
        <Col span={colSpan2}>
          <Form.Item name="major" label="专业">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={colSpan1}>
          <Space>
            <Form.Item name="start" label="起止时间">
              <DatePicker />
            </Form.Item>
            <Form.Item name="end">
              <DatePicker />
            </Form.Item>
            <Form.Item name="today" valuePropName="checked">
              <Checkbox>至今</Checkbox>
            </Form.Item>
          </Space>
        </Col>
        <Col span={colSpan2}>
          <Form.Item name="degree" label="学历">
            <Select options={degreeOptions}/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={24}>
          <Form.Item name="content" layout="vertical" label="学业/专业描述：">
            <QuillEditor />
          </Form.Item>
        </Col>
      </Row>
    </Form>
    </div>
  )
}

function EducationSetForm(props: IEducationSetFormProps) {
  const { dispatch, educationInfo = [], infoModuleList } = props;
  const handleChange = (values: IEducationSetFormValues, index?:number) => {
    let newEducationInfo = []
    const newValues = {
      ...values,
      start: dayjs(values?.start).format(format),
      end: dayjs(values?.end).format(format)
    }
    if(Number(index ?? -1) >= 0) {
      newEducationInfo = educationInfo?.map((item, idx) => {
        if(index === idx) {
          return {
            ...item,
            ...newValues,
          }
        }
        return item
      })
    } else {
      newEducationInfo = [
        ...educationInfo,
        newValues,
      ]
    }
    dispatch({
      type: `${EDIT_RESUME_NAME_SPACE}/changeFormValues`,
      payload: {
        key: ContentConfigKeyEnum.EDUCATION,
        value: newEducationInfo
      }
    })
  }

  const onAdd = () => {
    handleChange(emptyData)
  }
  const onSort = (type: SortTypeEnum, index: number) => {
    dispatch({
      type: `${EDIT_RESUME_NAME_SPACE}/sortModuleFormValues`,
      payload: {
        key: ContentConfigKeyEnum.EDUCATION,
        type,
        index,
      }
    })
  }

  return <div className="common-list-base-set-form-wrapper">
    {
      educationInfo?.map?.((item, index) => {
        return <EducationSetBaseForm
          key={`${item.name}-${item.start}-${item.end}-${item.major}-${item.content}-${index}`}
          onChange={(values: IEducationSetFormValues) => {
            handleChange(values, index)
          }}
          length={educationInfo.length}
          onSort={onSort}
          initValues={{
            ...item,
            start: !!item?.start ? dayjs(item?.start) : undefined,
            end: !!item?.end ? dayjs(item?.end) : undefined
          }}
          index={index}
        />
      })
    }
     <Button className="add-btn" onClick={onAdd}>新增{
      infoModuleList?.find(item => item.key === ContentConfigKeyEnum.WORK_EXPERIENCE)?.title
    }</Button>
  </div>
}
export default connect(({editResume}: {editResume: IEditResumeModel}) => {
  return {
    educationInfo: editResume.education,
    infoModuleList: editResume.moduleList
  }
})(EducationSetForm)