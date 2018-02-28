import React, { Component } from 'react';
import { observer } from 'mobx-react';
import MainStore from '../stores/MainStore';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

@observer
class Modal extends Component {

    render() {
        const style = {
            modalTitle: { textAlign: 'center' }
        };

        const { openModal } = MainStore;

        const actions = [
            <FlatButton
                label="Okay"
                keyboardFocused={true}
                onClick={() => MainStore.toggleModal(openModal.keys().next().value)}
            />,
        ];

        const terms = <span>
                        <h3>1. Terms</h3>
                        <p>By accessing this web site, you are agreeing to be bound by these
                            web site Terms and Conditions of Use, all applicable laws and regulations,
                            and agree that you are responsible for compliance with any applicable local
                            laws. If you do not agree with any of these terms, you are prohibited from
                            using or accessing this site. The materials contained in this web site are
                            protected by applicable copyright and trade mark law.</p>
                        <h3>2. Use License</h3>
                        <ol type="a">
                            <li>
                                Permission is granted to temporarily download one copy of the materials
                                (information or software) on Eat Safe Seattle's web site for personal,
                                non-commercial transitory viewing only. This is the grant of a license,
                                not a transfer of title, and under this license you may not:
                                <ol type="i">
                                    <li>modify or copy the materials;</li>
                                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                    <li>attempt to decompile or reverse engineer any software contained on Eat Safe Seattle's web site;</li>
                                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                                </ol>
                            </li>
                            <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Eat Safe Seattle at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
                        </ol>
                        <h3>3. Disclaimer</h3>
                        <ol type="a">
                            <li>The materials on Eat Safe Seattle's web site are provided "as is". Eat Safe Seattle makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights. Further, Eat Safe Seattle does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site.</li>
                        </ol>
                        <h3>4. Limitations</h3>
                        <p>In no event shall Eat Safe Seattle or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on Eat Safe Seattle's Internet site, even if Eat Safe Seattle or a Eat Safe Seattle authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>
                        <h3>5. Revisions and Errata</h3>
                        <p>The materials appearing on Eat Safe Seattle's web site could include technical, typographical, or photographic errors. Eat Safe Seattle does not warrant that any of the materials on its web site are accurate, complete, or current. Eat Safe Seattle may make changes to the materials contained on its web site at any time without notice. Eat Safe Seattle does not, however, make any commitment to update the materials.</p>
                        <h3>6. Links</h3>
                        <p>Eat Safe Seattle has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Eat Safe Seattle of the site. Use of any such linked web site is at the user's own risk.</p>
                        <h3>7. Site Terms of Use Modifications</h3>
                        <p>Eat Safe Seattle may revise these terms of use for its web site at any time without notice. By using this web site you are agreeing to be bound by the then current version of these Terms and Conditions of Use.</p>
                        <h3>8. Governing Law</h3>
                        <p>Any claim relating to Eat Safe Seattle's web site shall be governed by the laws of the State of Washington without regard to its conflict of law provisions.</p>
                        <p>General Terms and Conditions applicable to Use of a Web Site.</p>
                        <h2>Privacy Policy</h2>
                        <p>Your privacy is very important to us. Accordingly, we have developed this Policy in order for you to understand how we collect, use, communicate and disclose and make use of personal information. The following outlines our privacy policy.</p>
                        <ul>
                            <li>Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.</li>
                            <li>We will collect and use of personal information solely with the objective of fulfilling those purposes specified by us and for other compatible purposes, unless we obtain the consent of the individual concerned or as required by law.</li>
                            <li>We will only retain personal information as long as necessary for the fulfillment of those purposes.</li>
                            <li>We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</li>
                            <li>Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.</li>
                            <li>We will protect personal information by reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</li>
                            <li>We will make readily available to customers information about our policies and practices relating to the management of personal information.</li>
                        </ul>
                        <p>We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained.</p>
        </span>;

        const about = <span>
                       <p>Eat Safe Seattle started as an initiative to build something meaningful from open data available at King Counties open data portal.</p>
                    <p>The app only displays restaurants that have received at least one violation during any inspection in the previous 12 months. We do our best to report the facts based on the data available.</p>
                    <p>We use the latest food establishment inspection data available from King County. You can see the dataset <a href="https://data.kingcounty.gov/Health/Food-Establishment-Inspection-Data/f29f-zza5" target="_blank" rel="noopener noreferrer">HERE</a></p>
                    <p>Just because a restaurant has received some violations doesn't mean that it's unsafe to eat at. Use this app as a tool to help yourself make good choices based on your own risk tolerance level.</p>

                    <h4>Inspection Violations and Points</h4>
                    <p>
                        Every year King County health inspectors inspect thousands of restaurants. Inspections are based on predefined regulations that have been put into place in order to eliminate risk factors for food borne illness.
                        Violations are coded by color and have a certain point value assigned to them. Point values are determined by the risk associated with the violation. The more likely a violation is to cause illness, the higher the score.
                    </p>
                    <p>
                        <b>Red critical violations</b> are the violations with the greatest risk of causing food borne illness. A single red critical violation means that the food establishment has an unsatisfactory inspection.
                        Inspectors work with establishment operators to correct red critical violations before they leave the establishment.
                    </p>
                    <p>
                        <b>Blue violations</b> are related to the maintenance of the establishment and cleanliness. This could be things such as general cleaning or pest control issues.
                    </p>
                    <h4>General Guidelines</h4>
                    <ul>
                        <li>35 or more red critical violation points require a reinspection witin 14 days.</li>
                        <li>90 or more red critical violation points require the establishment be closed.</li>
                        <li>120 or more total (red & blue) points also requires the establishment be closed.</li>
                        <li>Establishments are allowed to reopen when they have remedied the conditions that led to the closure,
                            submitted a plan of correction to prevent recurrences, and obtained a reinspection.</li>
                    </ul>

                    <a href="https://www.kingcounty.gov/depts/health/environmental-health/food-safety/inspection-system.aspx" target="_blank" rel="noopener noreferrer">
                        Find more information at the King County Public Health website
                    </a>
        </span>;

        return (
            <Dialog
                title={openModal.has('about') ? 'About Eat Safe Seattle' : 'Terms and Conditions of Use'}
                titleStyle={style.modalTitle}
                actions={actions}
                modal={false}
                open={openModal.has('about') || openModal.has('terms')}
                onRequestClose={() => MainStore.toggleModal(openModal.keys().next().value)}
                autoScrollBodyContent={true}
            >
                {openModal.has('about') ? about : terms}
            </Dialog>
        );
    }
}

export default Modal;