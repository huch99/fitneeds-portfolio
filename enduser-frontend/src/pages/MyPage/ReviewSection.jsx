import React, { useState } from 'react';
import ReviewWriteSection from './ReviewWriteSection';

function ReviewSection({
  reviewTab,
  setReviewTab,
  setIsReviewModalOpen,
  setSelectedHistoryId
}) {
  return (
    <ReviewWriteSection
      reviewTab={reviewTab}
      setReviewTab={setReviewTab}
      setIsReviewModalOpen={setIsReviewModalOpen}
      setSelectedHistoryId={setSelectedHistoryId}
    />
  );
}

export default ReviewSection;
