@bp.route('/jobseekers', methods=['GET'])
@jwt_required()
def search_jobseekers():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user.user_type.value.lower() != 'employer':
        return jsonify({'error': 'Only employers can access this endpoint'}), 403
    
    employer = Employer.query.filter_by(id=user_id).first()
    if not employer:
        return jsonify({'error': 'Employer profile not found'}), 404
    if not employer.verified:
        return jsonify({'error': 'Payment required to view jobseeker profiles'}), 402
    
    job_category = request.args.get('job_category')
    availability = request.args.get('availability')
    min_salary = request.args.get('min_salary', type=int)
    max_salary = request.args.get('max_salary', type=int)
    location = request.args.get('location')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # SIMPLE APPROACH - Get all jobseekers and filter in Python
    # This avoids the SQL join issue completely
    all_jobseekers = Jobseeker.query.all()
    
    results = []
    for js in all_jobseekers:
        # Get the associated user
        user_info = User.query.get(js.id)
        if not user_info or not user_info.is_active:
            continue
        
        # Apply filters
        if job_category and js.job_category != job_category:
            continue
        if availability and js.availability_status != availability:
            continue
        if min_salary and (js.expected_salary is None or js.expected_salary < min_salary):
            continue
        if max_salary and (js.expected_salary is None or js.expected_salary > max_salary):
            continue
        if location and location.lower() not in (js.location or '').lower():
            continue
        
        results.append({
            'id': js.id,
            'full_name': js.full_name,
            'job_category': js.job_category,
            'availability_status': js.availability_status,
            'expected_salary': js.expected_salary,
            'location': js.location,
            'skills': js.skills
        })
    
    # Manual pagination
    start = (page - 1) * per_page
    end = start + per_page
    paginated_items = results[start:end]
    total_pages = (len(results) + per_page - 1) // per_page
    
    return jsonify({
        'jobseekers': paginated_items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': len(results),
            'pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }), 200
