import { FormBuilder } from '@angular/forms';
import { Control } from './control';

export class DesignerPanel extends Control {
  schedulerType: string;
  showLaviIconInFooter: string;
  enableMultiVerification: string;
  imageFile: File;
  imageFileURL: string;
  headerColor: string;
  headerBackgroundColor: string;
  activeBackColor: string;
  activeTextColor: string;
  inActiveBackColor: string;
  inActiveTextColor: string;
  formBackColor: string;
  formTextColor: string;
  primaryButtonBackColor: string;
  primaryButtonTextColor: string;
  primaryButtonText: object;
  secondaryButtonBackColor: string;
  secondaryButtonTextColor: string;
  secondaryButtonText: object;
  workflowName: string;
  name: string;
  showServiceIconsOnly: boolean;
  serviceTabText: object;
  informationTabText: object;
  locationTabText: object;
  appointmentTabText: object;
  reviewTabText: object;
  serviceHeadingText: object;
  informationHeadingText: object;
  locationHeadingText: object;
  appointmentHeadingText: object;
  reviewHeadingText: object;
  constructor(
    formBuilder,
    workFlowId,
    color,
    backgroundColor,
    logoURL,
    schedulerType,
    showLaviIconInFooter,
    enableMultiVerification,
    activeBackColor,
    activeTextColor,
    inActiveBackColor,
    inActiveTextColor,
    formBackColor,
    formTextColor,
    primaryButtonBackColor,
    primaryButtonTextColor,
    primaryButtonText,
    secondaryButtonBackColor,
    secondaryButtonTextColor,
    secondaryButtonText,
    name,
    showServiceIconsOnly: boolean = false,
    serviceTabText,
    informationTabText,
    locationTabText,
    appointmentTabText,
    reviewTabText,
    serviceHeadingText,
    informationHeadingText,
    locationHeadingText,
    appointmentHeadingText,
    reviewHeadingText,
  ) {
    super();
    this.InitializeForm(
      formBuilder,
      workFlowId,
      color,
      backgroundColor,
      schedulerType,
      showLaviIconInFooter,
      enableMultiVerification,
      activeBackColor,
      activeTextColor,
      inActiveBackColor,
      inActiveTextColor,
      formBackColor,
      formTextColor,
      primaryButtonBackColor,
      primaryButtonTextColor,
      primaryButtonText,
      secondaryButtonBackColor,
      secondaryButtonTextColor,
      secondaryButtonText,
      logoURL,
      name,
      showServiceIconsOnly,
      serviceTabText,
      informationTabText,
      locationTabText,
      appointmentTabText,
      reviewTabText,
      serviceHeadingText,
      informationHeadingText,
      locationHeadingText,
      appointmentHeadingText,
      reviewHeadingText
    );
    this.InitializeVariable(
      color,
      backgroundColor,
      logoURL,
      schedulerType,
      showLaviIconInFooter,
      enableMultiVerification,
      activeBackColor,
      activeTextColor,
      inActiveBackColor,
      inActiveTextColor,
      formBackColor,
      formTextColor,
      primaryButtonBackColor,
      primaryButtonTextColor,
      primaryButtonText,
      secondaryButtonBackColor,
      secondaryButtonTextColor,
      secondaryButtonText,
      name,
      showServiceIconsOnly,
      serviceTabText,
      informationTabText,
      locationTabText,
      appointmentTabText,
      reviewTabText,
      serviceHeadingText,
      informationHeadingText,
      locationHeadingText,
      appointmentHeadingText,
      reviewHeadingText
    );
  }
  private InitializeVariable(
    color: string,
    backgroundColor: string,
    logoURL: string,
    schedulerType: string,
    showLaviIconInFooter: string,
    enableMultiVerification: string,
    activeBackColor: string,
    activeTextColor: string,
    inActiveBackColor: string,
    inActiveTextColor: string,
    formBackColor: string,
    formTextColor: string,
    primaryButtonBackColor: string,
    primaryButtonTextColor: string,
    primaryButtonText: object,
    secondaryButtonBackColor: string,
    secondaryButtonTextColor: string,
    secondaryButtonText: object,
    name: string,
    showServiceIconsOnly: boolean,
    serviceTabText: object,
    informationTabText: object,
    locationTabText: object,
    appointmentTabText: object,
    reviewTabText: object,
    serviceHeadingText: object,
    informationHeadingText: object,
    locationHeadingText: object,
    appointmentHeadingText: object,
    reviewHeadingText: object,
  ) {
    this.schedulerType = schedulerType;
    this.headerColor = color;
    this.headerBackgroundColor = backgroundColor;
    this.imageFileURL = logoURL;
    this.imageFile = null;
    this.showLaviIconInFooter = showLaviIconInFooter;
    this.enableMultiVerification = enableMultiVerification;
    this.activeBackColor = activeBackColor;
    this.activeTextColor = activeTextColor;
    this.inActiveBackColor = inActiveBackColor;
    this.inActiveTextColor = inActiveTextColor;
    this.formBackColor = formBackColor;
    this.formTextColor = formTextColor;
    this.primaryButtonBackColor = primaryButtonBackColor;
    this.primaryButtonTextColor = primaryButtonTextColor;
    this.primaryButtonText = primaryButtonText;
    this.secondaryButtonBackColor = secondaryButtonBackColor;
    this.secondaryButtonTextColor = secondaryButtonTextColor;
    this.secondaryButtonText = secondaryButtonText;
    this.name = name;
    this.showServiceIconsOnly = showServiceIconsOnly;
    this.serviceTabText = serviceTabText;
    this.informationTabText = informationTabText;
    this.locationTabText = locationTabText;
    this.appointmentTabText = appointmentTabText;
    this.reviewTabText = reviewTabText;
    this.serviceHeadingText = serviceHeadingText;
    this.informationHeadingText = informationHeadingText;
    this.locationHeadingText = locationHeadingText;
    this.appointmentHeadingText = appointmentHeadingText;
    this.reviewHeadingText = reviewHeadingText;
  }
  private InitializeForm(
    formBuilder: FormBuilder,
    workFlowId: string,
    headerColor: string,
    headerBackgroundColor: string,
    schedulerType: string,
    showLaviIconInFooter: string,
    enableMultiVerification: string,
    activeBackColor: string,
    activeTextColor: string,
    inActiveBackColor: string,
    inActiveTextColor: string,
    formBackColor: string,
    formTextColor: string,
    primaryButtonBackColor: string,
    primaryButtonTextColor: string,
    primaryButtonText: object,
    secondaryButtonBackColor: string,
    secondaryButtonTextColor: string,
    secondaryButtonText: object,
    logoURL: string,
    name: string,
    showServiceIconsOnly: boolean,
    serviceTabText: object,
    informationTabText: object,
    locationTabText: object,
    appointmentTabText: object,
    reviewTabText: object,
    serviceHeadingText: object,
    informationHeadingText: object,
    locationHeadingText: object,
    appointmentHeadingText: object,
    reviewHeadingText: object,
  ) {
    this.form = formBuilder.group(
      {
        workFlowId: [workFlowId],
        headerColor: [headerColor],
        headerBackgroundColor: [headerBackgroundColor],
        schedulerType: [schedulerType],
        showLaviIconInFooter: [showLaviIconInFooter, { updateOn: 'change' }],
        enableMultiVerification: [
          enableMultiVerification,
          { updateOn: 'change' },
        ],
        imageFile: [this.imageFile],
        activeBackColor: [activeBackColor],
        activeTextColor: [activeTextColor],
        inActiveBackColor: [inActiveBackColor],
        inActiveTextColor: [inActiveTextColor],
        formBackColor: [formBackColor],
        formTextColor: [formTextColor],
        primaryButtonBackColor: [primaryButtonBackColor],
        primaryButtonTextColor: [primaryButtonTextColor],
        primaryButtonText: [primaryButtonText],
        secondaryButtonBackColor: [secondaryButtonBackColor],
        secondaryButtonTextColor: [secondaryButtonTextColor],
        secondaryButtonText: [secondaryButtonText],
        imageFileURL: [logoURL],
        name: [name, { updateOn: 'change' }],
        showServiceIconsOnly: [showServiceIconsOnly, { updateOn: 'change' }],
        serviceTabText: [serviceTabText],
        informationTabText: [informationTabText],
        locationTabText: [locationTabText],
        appointmentTabText: [appointmentTabText],
        reviewTabText: [reviewTabText],
        serviceHeadingText: [serviceHeadingText],
        informationHeadingText: [informationHeadingText],
        locationHeadingText: [locationHeadingText],
        appointmentHeadingText: [appointmentHeadingText],
        reviewHeadingText: [reviewHeadingText],
      },
      { updateOn: 'blur' }
    );
  }
}
