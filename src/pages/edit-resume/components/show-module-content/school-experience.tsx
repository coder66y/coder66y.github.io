import QuillEditor from "@/components/quill-editor"
import ReadItem from "@/components/read-item"
import { IEditResumeModel, ISchoolExperienceValues } from "@/models/edit-resume"
import { Col, Row } from "antd"
import { connect } from "dva"
import { injectIntl, IntlShape } from "react-intl"
export interface SchoolExperienceProps {
  schoolExperience: ISchoolExperienceValues[];
  intl: IntlShape;
}
function SchoolExperience(props: SchoolExperienceProps) {
  const { schoolExperience, intl } = props;
  const span= 8;
  const getIntlText = (id: string) => {
    return intl.formatMessage({id})
  }
  const getIntlTime = (date: string) => {
    return intl.formatDate(date, {
      month: 'short',
      year: "numeric",
      day: 'numeric'
    })
  }
  return (
    <div className="school-experience info-module-content-wrapper">
      {
        schoolExperience?.map?.(item => (
          <>
          <Row className="school-experience info-module-content" >
            <ReadItem needPlace className="left" value={
              <>
                <ReadItem value={getIntlTime(item.start)} suffix="&ensp;-&ensp;"/>
                {item.today ? getIntlText('present') : <ReadItem value={getIntlTime(item.end)}/>}
              </>
            } needCol span={span}/>
            <ReadItem needPlace className="center" value={item.name} needCol span={span}/>
            <ReadItem needPlace className="right" value={
              <>
                <ReadItem value={item.job} />
              </>
            } needCol span={span}/>
          </Row>
          {item?.content && <Row>
            <Col span={24}>
            <QuillEditor readOnly value={item.content}/>
            </Col>
          </Row>}
          </>
        ))
      }
    </div>
  )
}

const mapStateToProps = ({editResume}: { editResume: IEditResumeModel}) => ({
  schoolExperience: editResume.schoolExperience
})

export default connect(mapStateToProps)(injectIntl(SchoolExperience))