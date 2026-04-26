function PageSection({ title, description, endpoint, actions }) {
  return (
    <section className="page-section">
      <div className="page-section-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {actions ? <div className="inline-actions">{actions}</div> : null}
      </div>
      <div className="endpoint-chip">{endpoint}</div>
    </section>
  );
}

export default PageSection;
